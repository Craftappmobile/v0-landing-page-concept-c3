import { NextResponse } from "next/server"
import { mcpServerCard } from "@/lib/agent-metadata"

export const dynamic = "force-static"

// Alias path some clients probe in addition to /.well-known/mcp/server-card.json.
export async function GET() {
  return NextResponse.json(mcpServerCard, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
