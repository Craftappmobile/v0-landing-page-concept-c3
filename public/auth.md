# Vjazhi auth.md

Agent registration and authentication discovery for Vjazhi (Розрахуй і В'яжи - https://vjazhi.com.ua).

## Audience
AI agents, autonomous assistants, and automated tools accessing Vjazhi resources.

## Public Endpoints (No Auth Required)
The following resources are freely accessible to AI agents without authentication:
- **Homepage**: `https://vjazhi.com.ua/`
- **Knitting Calculators**: `https://vjazhi.com.ua/kalkuliatory`
- **Guides and Articles**: `https://vjazhi.com.ua/blog`
- **API Catalog (RFC 9727)**: `https://vjazhi.com.ua/.well-known/api-catalog`
- **Agent Skills Discovery Index (RFC v0.2.0)**: `https://vjazhi.com.ua/.well-known/agent-skills/index.json`
- **ARD Capability Manifest**: `https://vjazhi.com.ua/.well-known/ai-catalog.json`

## Authentication & Authorization
Vjazhi does not currently expose a public OAuth authorization server or an authenticated
machine-to-machine API. Only the public resources listed above are available to agents, and
no credentials are required to access them. User accounts and the Premium subscription are
handled inside the mobile app, not via a public API.

## Agent Policy
- Respect robots.txt directives and Content-Signal declarations (`Content-Signal: ai-train=no, search=yes, ai-input=yes`).
- Please set a descriptive `User-Agent` header identifying your agent or service.
