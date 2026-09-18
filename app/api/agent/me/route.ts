import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { OAUTH_ISSUER, getVerificationKey } from "@/lib/oauth"

export const dynamic = "force-dynamic"

/**
 * Example protected resource. Agents authenticate with an access token obtained
 * from /api/oauth/token and send it as `Authorization: Bearer <token>`.
 */
export async function GET(request: Request) {
  const header = request.headers.get("authorization") ?? ""
  if (!header.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json(
      { error: "invalid_token", error_description: "Missing bearer token" },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": `Bearer realm="vjazhi", as_uri="${OAUTH_ISSUER}/.well-known/oauth-authorization-server"`,
          "Cache-Control": "no-store",
        },
      },
    )
  }

  const key = await getVerificationKey()
  if (!key) {
    return NextResponse.json(
      { error: "temporarily_unavailable", error_description: "Token verification is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }

  try {
    const { payload } = await jwtVerify(header.slice(7).trim(), key, { issuer: OAUTH_ISSUER })
    return NextResponse.json(
      {
        subject: payload.sub ?? null,
        client_id: payload.client_id ?? null,
        scope: payload.scope ?? null,
        issuer: payload.iss ?? null,
        expires_at: payload.exp ?? null,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    )
  } catch {
    return NextResponse.json(
      { error: "invalid_token", error_description: "Token is invalid or expired" },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": `Bearer realm="vjazhi", error="invalid_token"`,
          "Cache-Control": "no-store",
        },
      },
    )
  }
}
