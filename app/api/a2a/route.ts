import { NextResponse } from "next/server"
import { getAgentTool } from "@/lib/agent-tools"
import { a2aAgentCard } from "@/lib/agent-metadata"

export const dynamic = "force-dynamic"

type Artifact = { artifactId: string; name: string; parts: Array<{ kind: "text"; text: string }> }
type Task = { id: string; status: { state: string; timestamp: string }; artifacts: Artifact[] }

type JsonRpcRequest = {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: Record<string, unknown>
}

const tasks = new Map<string, Task>()
const MAX_TASKS = 200

function rpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result }
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } }
}

function textFromMessage(message: unknown): string {
  if (!message || typeof message !== "object") return ""
  const parts = (message as { parts?: unknown }).parts
  if (!Array.isArray(parts)) return ""
  return parts
    .map((part) => {
      if (part && typeof part === "object") {
        const candidate = part as { kind?: string; text?: string }
        if (candidate.kind === "text" && typeof candidate.text === "string") return candidate.text
      }
      return ""
    })
    .join("\n")
    .trim()
}

function numbersIn(text: string): number[] {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((value) => Number(value.replace(",", ".")))
}

function resolveSkill(text: string): { skill: string; output: unknown } {
  const lower = text.toLowerCase()
  const values = numbersIn(text)

  if ((lower.includes("gauge") || lower.includes("щільн")) && values.length >= 2) {
    return {
      skill: "calculate_gauge",
      output: getAgentTool("calculate_gauge")!.run({
        stitches_in_10cm: values[0],
        rows_in_10cm: values[1],
      }),
    }
  }

  const category = ["women", "men", "kids", "accessories", "blankets"].find((item) =>
    lower.includes(item),
  )
  const product = [
    "sweater",
    "cardigan",
    "vest",
    "dress",
    "tshirt",
    "socks",
    "scarf",
    "gloves",
    "plaid",
  ].find((item) => lower.includes(item))

  if ((lower.includes("yarn") || lower.includes("пряж") || lower.includes("витрат")) && category && product) {
    try {
      return {
        skill: "estimate_yarn_consumption",
        output: getAgentTool("estimate_yarn_consumption")!.run({ category, product }),
      }
    } catch {
      // fall through to calculator search
    }
  }

  return {
    skill: "search_calculators",
    output: getAgentTool("search_calculators")!.run({ query: text || "knitting", limit: 5 }),
  }
}

function handle(request: JsonRpcRequest) {
  const id = request.id ?? null
  const params = request.params ?? {}

  switch (request.method) {
    case "message/send": {
      const text = textFromMessage(params.message)
      const result = resolveSkill(text)
      const task: Task = {
        id: crypto.randomUUID(),
        status: { state: "completed", timestamp: new Date().toISOString() },
        artifacts: [
          {
            artifactId: crypto.randomUUID(),
            name: result.skill,
            parts: [{ kind: "text", text: JSON.stringify(result.output, null, 2) }],
          },
        ],
      }
      if (tasks.size >= MAX_TASKS) {
        const oldest = tasks.keys().next().value
        if (oldest) tasks.delete(oldest)
      }
      tasks.set(task.id, task)
      return rpcResult(id, task)
    }
    case "tasks/get": {
      const taskId = String(params.taskId ?? params.id ?? "")
      const task = tasks.get(taskId)
      if (!task) return rpcError(id, -32001, `Task not found: ${taskId}`)
      return rpcResult(id, task)
    }
    case "agent/getCard":
      return rpcResult(id, a2aAgentCard)
    default:
      return rpcError(id, -32601, `Method not found: ${String(request.method ?? "")}`)
  }
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(rpcError(null, -32700, "Parse error"), { status: 400 })
  }
  const response = handle(payload as JsonRpcRequest)
  return NextResponse.json(response, {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  })
}

export async function GET() {
  return NextResponse.json(
    { jsonrpc: "2.0", error: { code: -32000, message: "Use POST with JSON-RPC." } },
    { status: 405, headers: { Allow: "POST, OPTIONS" } },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  })
}
