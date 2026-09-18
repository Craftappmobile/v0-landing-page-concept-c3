import { NextResponse } from "next/server"
import { getPublicJwks } from "@/lib/oauth"

export const dynamic = "force-dynamic"

export async function GET() {
  const jwks = await getPublicJwks()
  return NextResponse.json(jwks, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
