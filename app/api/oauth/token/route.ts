import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import {
  OAUTH_ISSUER,
  OAUTH_SCOPES,
  getSigningJwk,
  getVerificationKey,
  isValidClient,
  pkceChallenge,
  signAgentJwt,
} from "@/lib/oauth"

export const dynamic = "force-dynamic"

function oauthError(status: number, error: string, description: string) {
  const headers: Record<string, string> = { "Cache-Control": "no-store" }
  if (error === "invalid_client") headers["WWW-Authenticate"] = 'Basic realm="vjazhi"'
  return NextResponse.json({ error, error_description: description }, { status, headers })
}

function readClientCredentials(request: Request, form: FormData) {
  const header = request.headers.get("authorization")
  if (header && header.toLowerCase().startsWith("basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8")
    const separator = decoded.indexOf(":")
    if (separator >= 0) {
      return { clientId: decoded.slice(0, separator), clientSecret: decoded.slice(separator + 1) }
    }
  }
  return {
    clientId: String(form.get("client_id") ?? ""),
    clientSecret: String(form.get("client_secret") ?? ""),
  }
}

function tokenResponse(accessToken: string, scope: string) {
  return NextResponse.json(
    { access_token: accessToken, token_type: "Bearer", expires_in: 3600, scope },
    { status: 200, headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } },
  )
}

export async function POST(request: Request) {
  const signingJwk = getSigningJwk()
  if (!signingJwk) {
    return oauthError(503, "temporarily_unavailable", "Token signing key (OAUTH_SIGNING_JWK) is not configured")
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return oauthError(400, "invalid_request", "Body must be application/x-www-form-urlencoded")
  }

  const grantType = String(form.get("grant_type") ?? "")
  const { clientId, clientSecret } = readClientCredentials(request, form)
  if (!clientId || !isValidClient(clientId, clientSecret)) {
    return oauthError(401, "invalid_client", "Client authentication failed")
  }

  const requested = String(form.get("scope") ?? "").split(/\s+/).filter(Boolean)
  const scope = requested.length > 0 ? requested.filter((item) => OAUTH_SCOPES.includes(item)) : OAUTH_SCOPES
  if (scope.length === 0) {
    return oauthError(400, "invalid_scope", `Supported scopes: ${OAUTH_SCOPES.join(" ")}`)
  }

  if (grantType === "client_credentials") {
    const token = await signAgentJwt({ sub: clientId, client_id: clientId, scope: scope.join(" ") }, "1h")
    return tokenResponse(token, scope.join(" "))
  }

  if (grantType === "authorization_code") {
    const code = String(form.get("code") ?? "")
    const redirectUri = String(form.get("redirect_uri") ?? "")
    if (!code || !redirectUri) {
      return oauthError(400, "invalid_request", "code and redirect_uri are required")
    }
    try {
      const key = await getVerificationKey()
      if (!key) return oauthError(503, "temporarily_unavailable", "Token verification is not configured")
      const { payload } = await jwtVerify(code, key, { issuer: OAUTH_ISSUER })
      if (payload.client_id !== clientId) {
        return oauthError(400, "invalid_grant", "Authorization code was issued to another client")
      }
      if (payload.redirect_uri !== redirectUri) {
        return oauthError(400, "invalid_grant", "redirect_uri does not match the authorization request")
      }
      const challenge = typeof payload.code_challenge === "string" ? payload.code_challenge : null
      if (challenge && pkceChallenge(String(form.get("code_verifier") ?? "")) !== challenge) {
        return oauthError(400, "invalid_grant", "PKCE verification failed")
      }
      const granted = typeof payload.scope === "string" && payload.scope ? payload.scope : scope.join(" ")
      const token = await signAgentJwt({ sub: clientId, client_id: clientId, scope: granted }, "1h")
      return tokenResponse(token, granted)
    } catch {
      return oauthError(400, "invalid_grant", "Invalid or expired authorization code")
    }
  }

  return oauthError(400, "unsupported_grant_type", "Supported grant types: client_credentials, authorization_code")
}
