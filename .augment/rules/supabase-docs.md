---
type: agent_requested
description: Supabase-related work including database schema, SQL, migrations, auth, RLS or policies, storage, CLI usage, and server or client integration patterns
---

# Supabase Documentation Rule

Apply this rule whenever a task touches Supabase code, schema, configuration, or operations.

- Before proposing or writing Supabase-related code, SQL, policies, or CLI commands, check the latest relevant Supabase documentation.
- Treat current Supabase docs as the source of truth for APIs, CLI flags, auth behavior, RLS or policy requirements, storage behavior, and migration workflow. Do not guess or invent commands, helpers, or APIs.
- Use repository-local sources together with the docs:
  - `README.md` for stack, env vars, and project references
  - `lib/supabase.ts` for the current client patterns in this repo
  - `docs/subscriptions-schema-reference.md` for the repo-level schema reference
  - `supabase/migrations/*` for committed database changes
- Keep privilege boundaries explicit:
  - never use `SUPABASE_SERVICE_ROLE_KEY` in client or browser code
  - prefer anon or authenticated user-context access for user-scoped flows
  - use admin or service-role access only in trusted server code when required
- If a change affects tables, auth, access control, or stored data flows, explicitly consider RLS or policy impact and do not skip required migration or policy steps.
- For SQL or migration changes, prefer additive, reviewable migrations that match the repo convention instead of undocumented dashboard-only edits.
- If repository behavior and current Supabase docs appear to differ, preserve existing project behavior, note the mismatch clearly, and explain the safest next step.