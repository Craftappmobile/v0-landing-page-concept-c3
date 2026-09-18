import { NextResponse } from "next/server"
import { OAUTH_ISSUER, OAUTH_SCOPES } from "@/lib/oauth"

export const dynamic = "force-static"

export async function GET() {
  const metadata = {
    issuer: OAUTH_ISSUER,
    authorization_endpoint: `${OAUTH_ISSUER}/api/oauth/authorize`,
    token_endpoint: `${OAUTH_ISSUER}/api/oauth/token`,
    registration_endpoint: `${OAUTH_ISSUER}/api/agent/register`,
    jwks_uri: `${OAUTH_ISSUER}/.well-known/jwks.json`,
    scopes_supported: OAUTH_SCOPES,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "client_credentials"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
    code_challenge_methods_supported: ["S256"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
  }

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
