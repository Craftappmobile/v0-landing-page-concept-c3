import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const jwks = {
    keys: [],
  }

  return NextResponse.json(jwks, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
