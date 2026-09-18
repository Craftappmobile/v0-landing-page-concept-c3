import { NextResponse } from "next/server"
import { agentTools, getAgentTool } from "@/lib/agent-tools"
import { mcpServerCard } from "@/lib/agent-metadata"

export const dynamic = "force-dynamic"

const PROTOCOL_VERSION = "2025-06-18"
const SESSION_ID = "vjazhi-mcp"

type JsonRpcRequest = {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: Record<string, unknown>
}

function rpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result }
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } }
}

function handle(request: JsonRpcRequest) {
  const id = request.id ?? null
  switch (request.method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: mcpServerCard.serverInfo.name,
          version: mcpServerCard.serverInfo.version,
        },
      })
    case "notifications/initialized":
    case "notifications/cancelled":
      return null
    case "ping":
      return rpcResult(id, {})
    case "tools/list":
      return rpcResult(id, {
        tools: agentTools.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
        })),
      })
    case "tools/call": {
      const params = request.params ?? {}
      const tool = getAgentTool(String(params.name ?? ""))
      if (!tool) return rpcError(id, -32602, `Unknown tool: ${String(params.name ?? "")}`)
      const args = (params.arguments ?? {}) as Record<string, unknown>
      try {
        const output = tool.run(args)
        return rpcResult(id, {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          isError: false,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : "Tool execution failed"
        return rpcResult(id, { content: [{ type: "text", text: message }], isError: true })
      }
    }
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

  if (Array.isArray(payload)) {
    const responses = payload
      .map((item) => handle(item as JsonRpcRequest))
      .filter((item) => item !== null)
    if (responses.length === 0) return new NextResponse(null, { status: 202 })
    return NextResponse.json(responses, {
      status: 200,
      headers: { "Mcp-Session-Id": SESSION_ID, "Access-Control-Allow-Origin": "*" },
    })
  }

  const response = handle(payload as JsonRpcRequest)
  // Notifications (no id) must not receive a JSON-RPC response body.
  if (response === null) return new NextResponse(null, { status: 202 })
  return NextResponse.json(response, {
    status: 200,
    headers: { "Mcp-Session-Id": SESSION_ID, "Access-Control-Allow-Origin": "*" },
  })
}

export async function GET() {
  return NextResponse.json(
    { jsonrpc: "2.0", error: { code: -32000, message: "Use POST with JSON-RPC. Server-Sent Events are not supported." } },
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
      "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
    },
  })
}
