import { randomBytes } from "node:crypto"
import { exportJWK, generateKeyPair } from "jose"

const KID = "vjazhi-agent-1"

const { privateKey, publicKey } = await generateKeyPair("RS256", { extractable: true })

const privateJwk = await exportJWK(privateKey)
const publicJwk = await exportJWK(publicKey)

privateJwk.kid = KID
privateJwk.alg = "RS256"
privateJwk.use = "sig"

const serverSecret = randomBytes(32).toString("base64url")

console.log("Generated agent OAuth key material.\n")
console.log("Add these two variables to .env.local AND to Vercel → Settings → Environment Variables:\n")
console.log(`OAUTH_SIGNING_JWK=${JSON.stringify(privateJwk)}`)
console.log(`OAUTH_SERVER_SECRET=${serverSecret}`)
console.log("\nPublic JWKS (this is served automatically at /.well-known/jwks.json):\n")
console.log(
  JSON.stringify(
    { keys: [{ ...publicJwk, kid: KID, alg: "RS256", use: "sig" }] },
    null,
    2,
  ),
)
console.log("\nRedeploy (or restart the dev server) after setting the variables.")
