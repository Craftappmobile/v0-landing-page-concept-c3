import { NextResponse } from "next/server"
import { OAUTH_SCOPES, clientSecretFor, pkceChallenge, signAgentJwt } from "@/lib/oauth"

export const dynamic = "force-dynamic"

function errorRedirect(redirectUri: string | null, error: string, description: string, state: string | null) {
  if (redirectUri) {
    const target = new URL(redirectUri)
    target.searchParams.set("error", error)
    target.searchParams.set("error_description", description)
    if (state) target.searchParams.set("state", state)
    return NextResponse.redirect(target, 302)
  }
  return NextResponse.json({ error, error_description: description }, { status: 400 })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const clientId = url.searchParams.get("client_id") ?? ""
  const redirectUri = url.searchParams.get("redirect_uri")
  const responseType = url.searchParams.get("response_type") ?? ""
  const state = url.searchParams.get("state")
  const scope = url.searchParams.get("scope") ?? ""
  const codeChallenge = url.searchParams.get("code_challenge")
  const codeChallengeMethod = url.searchParams.get("code_challenge_method") ?? "S256"

  // This authorization server is for machine agents only: there is no interactive
  // user login, and consent is implicit for any client that has registered at
  // /api/agent/register. All exposed scopes are read-only.
  if (!clientId || !clientSecretFor(clientId)) {
    return errorRedirect(
      null,
      "invalid_client",
      "Unknown client_id. Register at /api/agent/register first.",
      state,
    )
  }

  if (!redirectUri) return errorRedirect(null, "invalid_request", "redirect_uri is required", state)

  let parsed: URL
  try {
    parsed = new URL(redirectUri)
  } catch {
    return errorRedirect(null, "invalid_request", "redirect_uri must be an absolute URL", state)
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    return errorRedirect(null, "invalid_request", "redirect_uri must use https", state)
  }

  if (responseType !== "code") {
    return errorRedirect(redirectUri, "unsupported_response_type", "Only response_type=code is supported", state)
  }

  const scopes = scope.split(/\s+/).filter((item) => OAUTH_SCOPES.includes(item))
  const granted = (scopes.length > 0 ? scopes : OAUTH_SCOPES).join(" ")

  const code = await signAgentJwt(
    {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: granted,
      ...(codeChallenge
        ? { code_challenge: codeChallengeMethod === "S256" ? codeChallenge : pkceChallenge(codeChallenge) }
        : {}),
    },
    "2m",
  )

  const target = new URL(redirectUri)
  target.searchParams.set("code", code)
  if (state) target.searchParams.set("state", state)
  return NextResponse.redirect(target, 302)
}
