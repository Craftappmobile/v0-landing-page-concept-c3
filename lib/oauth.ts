import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { SignJWT, importJWK, type JWK } from "jose"
import { siteUrl } from "./agent-metadata"

export const OAUTH_ISSUER = siteUrl
export const OAUTH_SCOPES = ["knitting:calculators:read"]
export const OAUTH_DEFAULT_KID = "vjazhi-agent-1"

function readJsonEnv(name: string): JWK | null {
  const raw = process.env[name]
  if (!raw) return null
  try {
    return JSON.parse(raw) as JWK
  } catch {
    return null
  }
}

export function getSigningJwk(): JWK | null {
  return readJsonEnv("OAUTH_SIGNING_JWK")
}

export function getServerSecret(): string | null {
  return process.env.OAUTH_SERVER_SECRET?.trim() || null
}

export function getKeyId(): string {
  return getSigningJwk()?.kid || OAUTH_DEFAULT_KID
}

export async function signAgentJwt(payload: Record<string, unknown>, expiresIn: string): Promise<string> {
  const jwk = getSigningJwk()
  if (!jwk) throw new Error("OAUTH_SIGNING_JWK is not configured")
  const key = await importJWK(jwk, "RS256")
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", kid: getKeyId(), typ: "at+jwt" })
    .setIssuer(OAUTH_ISSUER)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key)
}

function toPublicJwk(jwk: JWK): JWK {
  const { d, p, q, dp, dq, qi, oth, ...publicKey } = jwk as JWK & Record<string, unknown>
  void d
  void p
  void q
  void dp
  void dq
  void qi
  void oth
  return publicKey as JWK
}

export async function getPublicJwks(): Promise<{ keys: JWK[] }> {
  const jwk = getSigningJwk()
  if (!jwk) return { keys: [] }
  return { keys: [{ ...toPublicJwk(jwk), use: "sig", alg: "RS256" } as JWK] }
}

/**
 * jose v6 requires a *public* key for verification, so the private JWK members
 * are stripped before import.
 */
export async function getVerificationKey(): Promise<Awaited<ReturnType<typeof importJWK>> | null> {
  const jwk = getSigningJwk()
  if (!jwk) return null
  return importJWK(toPublicJwk(jwk), "RS256")
}

/**
 * Deterministic client secret for a client id, derived from the server secret.
 * This lets agents self-register (anonymous identity) without a database.
 */
export function clientSecretFor(clientId: string): string | null {
  const secret = getServerSecret()
  if (!secret) return null
  return createHmac("sha256", secret).update(clientId).digest("base64url")
}

export function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function isValidClient(clientId: string, clientSecret: string): boolean {
  const expected = clientSecretFor(clientId)
  if (!expected) return false
  return secretsMatch(clientSecret, expected)
}

export function pkceChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url")
}
