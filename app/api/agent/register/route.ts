import { NextResponse } from "next/server"
import { OAUTH_ISSUER, OAUTH_SCOPES, clientSecretFor, getServerSecret } from "@/lib/oauth"

export const dynamic = "force-dynamic"

/**
 * Anonymous agent registration.
 *
 * Issues a client_id plus a deterministic client_secret derived from the server
 * secret, so no database is required. The resulting credentials can be used with
 * the client_credentials and authorization_code grants of this authorization
 * server. Only read-only scopes are available.
 */
export async function POST(request: Request) {
  if (!getServerSecret()) {
    return NextResponse.json(
      { error: "temporarily_unavailable", error_description: "Agent registration is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }

  let clientName = "anonymous-agent"
  try {
    const body = (await request.json()) as { client_name?: unknown }
    if (typeof body?.client_name === "string" && body.client_name.trim() !== "") {
      clientName = body.client_name.trim().slice(0, 64)
    }
  } catch {
    // Body is optional.
  }

  const clientId = `agent-${crypto.randomUUID()}`
  const clientSecret = clientSecretFor(clientId)

  return NextResponse.json(
    {
      client_id: clientId,
      client_secret: clientSecret,
      client_name: clientName,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      issuer: OAUTH_ISSUER,
      registration_endpoint: `${OAUTH_ISSUER}/api/agent/register`,
      authorization_endpoint: `${OAUTH_ISSUER}/api/oauth/authorize`,
      token_endpoint: `${OAUTH_ISSUER}/api/oauth/token`,
      scopes_supported: OAUTH_SCOPES,
      grant_types_supported: ["client_credentials", "authorization_code"],
      token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
    },
    {
      status: 201,
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
