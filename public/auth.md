# Vjazhi auth.md

Agent registration and authentication discovery for Vjazhi (https://vjazhi.com.ua).

## Audience
AI agents, autonomous assistants and automated tools that access Vjazhi resources.

## Public Endpoints (No Auth Required)
- **Homepage**: `https://vjazhi.com.ua/`
- **Knitting Calculators**: `https://vjazhi.com.ua/kalkuliatory`
- **Guides and Articles**: `https://vjazhi.com.ua/blog`
- **MCP server endpoint**: `https://vjazhi.com.ua/api/mcp`
- **A2A agent endpoint**: `https://vjazhi.com.ua/api/a2a`
- **MCP Server Card (SEP-1649)**: `https://vjazhi.com.ua/.well-known/mcp/server-card.json`
- **A2A Agent Card**: `https://vjazhi.com.ua/.well-known/agent-card.json`
- **Agent Skills Discovery Index**: `https://vjazhi.com.ua/.well-known/agent-skills/index.json`
- **API Catalog (RFC 9727)**: `https://vjazhi.com.ua/.well-known/api-catalog`
- **ARD Capability Manifest**: `https://vjazhi.com.ua/.well-known/ai-catalog.json`

## Agent Registration
Agents self-register to obtain OAuth 2.0 client credentials (anonymous identity, no human
account required):

1. **Register**: `POST https://vjazhi.com.ua/api/agent/register` returns `client_id` and `client_secret`.
2. **Get a token**: `POST https://vjazhi.com.ua/api/oauth/token` with
   `grant_type=client_credentials&client_id=...&client_secret=...` (form body or HTTP Basic).
3. **Call the resource**: send `Authorization: Bearer <access_token>`, for example to
   `GET https://vjazhi.com.ua/api/agent/me`.

Registration details:
- `identity_types_supported`: `anonymous`
- `credential_types_supported`: `client_secret` (issued at registration)
- `register_uri`: `https://vjazhi.com.ua/api/agent/register`
- `claim_uri`: `https://vjazhi.com.ua/auth.md`
- `grant_types_supported`: `client_credentials`, `authorization_code`
- `token_endpoint_auth_methods_supported`: `client_secret_basic`, `client_secret_post`
- `scopes_supported`: `knitting:calculators:read`

## Authorization Server Metadata
- **Authorization Server**: `https://vjazhi.com.ua/.well-known/oauth-authorization-server`
- **OpenID Configuration**: `https://vjazhi.com.ua/.well-known/openid-configuration`
- **JWKS**: `https://vjazhi.com.ua/.well-known/jwks.json`
- **Protected Resource Metadata (RFC 9728)**: `https://vjazhi.com.ua/.well-known/oauth-protected-resource`
- **Issuer**: `https://vjazhi.com.ua` — matches the issuer advertised in the protected resource metadata.

Access tokens are RS256-signed JWTs valid for 1 hour. Verification keys are published at the
JWKS URL above.

## Agent Policy
- Respect robots.txt directives and Content-Signal declarations (`Content-Signal: ai-train=no, search=yes, ai-input=yes`).
- Set a descriptive `User-Agent` header identifying your agent or service.
