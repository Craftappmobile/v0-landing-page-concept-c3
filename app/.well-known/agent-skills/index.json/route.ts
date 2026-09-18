import { NextResponse } from "next/server"
import { skillsIndex } from "@/lib/agent-metadata"

export const dynamic = "force-static"

export async function GET() {
  return NextResponse.json(skillsIndex, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
