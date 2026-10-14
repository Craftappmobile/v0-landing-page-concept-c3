import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import test from "node:test"

import { normalizeSubscriptionStatus } from "../lib/payment-flow.ts"
import { computeExpirationCutoff } from "../lib/expire-subscriptions.ts"

const migrationUrl = new URL("../supabase/migrations/2026101401_preserve_unlimited_profile_access.sql", import.meta.url)
const migration = readFileSync(migrationUrl, "utf8").replace(/--[^\r\n]*/g, "")
const statements = migration.replace(/\s+/g, " ").trim()
const functions = [...migration.matchAll(/CREATE OR REPLACE FUNCTION public\.(\w+)\([^)]*\)[\s\S]*?AS \$function\$([\s\S]*?)\$function\$;/g)]
const helper = functions.find((entry) => entry[1] === "recalculate_profile_subscription_access")?.[2] ?? ""
const trigger = functions.find((entry) => entry[1] === "update_profile_on_subscription_change")?.[2] ?? ""

// These are migration contract checks, not a substitute for executing PostgreSQL.
// The optional integration test below executes the actual migration and fixtures.
test("migration locks the affected profile before a separate subscription selection", () => {
  assert.ok(helper.length > 0)
  assert.match(helper, /PERFORM p\.id FROM public\.profiles AS p\s+WHERE p\.id = p_user_id\s+FOR UPDATE;/)
  assert.ok(helper.indexOf("FOR UPDATE;") < helper.indexOf("FROM public.subscriptions"))
  assert.match(helper, /IF NOT FOUND THEN\s+RETURN;\s+END IF;\s+SELECT candidate/)
  assert.match(helper, /WHERE s\.user_id = p_user_id/)
  assert.match(helper, /WHERE p\.id = p_user_id\s+AND/)
})

test("selection preserves paid failed/cancelled time and handles unlimited NULL expiry conservatively", () => {
  assert.match(helper, /s\.status IN \('active', 'cancelled', 'failed'\)/)
  assert.match(helper, /candidate\.expires_at > pg_catalog\.now\(\)/)
  assert.match(helper, /candidate\.expires_at IS NULL\s+AND candidate\.status = 'active'\s+AND candidate\.plan_type IN \('lifetime', 'forever'\)/)
  assert.match(helper, /candidate\.plan_type IS NOT NULL\s+AND candidate\.plan_type <> 'free'/)
  assert.match(helper, /COALESCE\(NULLIF\(s\.plan_type::text, ''\), NULLIF\(s\.plan, ''\)\)/)
  assert.match(helper, /IF NOT FOUND THEN\s+v_subscription_type := 'free';\s+v_expires_at := NULL;/)
})

test("unlimited priority and deterministic tie breakers do not depend on metadata updates", () => {
  assert.match(helper, /ORDER BY\s+CASE WHEN candidate\.plan_type IN \('lifetime', 'forever'\) THEN 0 ELSE 1 END,\s+candidate\.expires_at DESC NULLS FIRST,\s+candidate\.started_at DESC NULLS LAST,\s+candidate\.id DESC\s+LIMIT 1;/)
  assert.doesNotMatch(helper, /updated_at|auto_renewal|recurring_mode/)
})

test("trigger safely handles deletion, linking, unlinking, and ordered old/new profile locks", () => {
  assert.match(trigger, /IF TG_OP IN \('UPDATE', 'DELETE'\) THEN\s+v_old_user_id := OLD\.user_id;/)
  assert.match(trigger, /IF TG_OP IN \('INSERT', 'UPDATE'\) THEN\s+v_new_user_id := NEW\.user_id;/)
  assert.match(trigger, /SELECT DISTINCT affected\.user_id[\s\S]*pg_catalog\.unnest\(ARRAY\[v_old_user_id, v_new_user_id\]\)[\s\S]*WHERE affected\.user_id IS NOT NULL\s+ORDER BY affected\.user_id/)
  assert.match(trigger, /PERFORM public\.recalculate_profile_subscription_access\(v_user_id\);/)
  assert.match(trigger, /IF TG_OP = 'DELETE' THEN\s+RETURN OLD;/)
  assert.match(statements, /CREATE TRIGGER update_profile_on_subscription_change_trigger AFTER INSERT OR UPDATE OR DELETE ON public\.subscriptions FOR EACH ROW EXECUTE FUNCTION public\.update_profile_on_subscription_change\(\);/)
})

test("definer functions pin search_path without leaking session settings or exposing client RPCs", () => {
  assert.equal(functions.length, 2)
  for (const entry of functions) {
    assert.match(entry[0], /SECURITY DEFINER\s+SET search_path TO ''\s+AS/)
    assert.doesNotMatch(entry[2], /\bSET\s+(?:LOCAL\s+)?search_path|\bset_config\s*\(/i)
  }
  assert.match(statements, /REVOKE ALL ON FUNCTION public\.recalculate_profile_subscription_access\(uuid\) FROM PUBLIC, anon, authenticated;/)
  assert.match(statements, /GRANT EXECUTE ON FUNCTION public\.recalculate_profile_subscription_access\(uuid\) TO service_role;/)
  assert.match(statements, /REVOKE ALL ON FUNCTION public\.update_profile_on_subscription_change\(\) FROM PUBLIC, anon, authenticated, service_role;/)
  const outsideFunctions = migration.replace(/CREATE OR REPLACE FUNCTION[\s\S]*?\$function\$;/g, "")
  assert.doesNotMatch(outsideFunctions, /^\s*(?:UPDATE\s|INSERT\s+INTO|DELETE\s+FROM|DO\s)/im)
  assert.doesNotMatch(migration, /ALTER\s+TABLE|CREATE\s+POLICY|auth\.users|[0-9a-f]{8}-[0-9a-f]{4}-/i)
})

test("repository status normalization requires future paid time for failed/cancelled rows", () => {
  for (const status of ["cancelled", "failed"]) {
    assert.equal(normalizeSubscriptionStatus({ status, expiresAt: "2999-01-01T00:00:00Z" }), "active")
    for (const expiresAt of [null, "2000-01-01T00:00:00Z"]) {
      assert.equal(normalizeSubscriptionStatus({ status, expiresAt }), "failed")
    }
  }
  assert.equal(
    computeExpirationCutoff(new Date("2026-10-14T00:00:00Z")),
    "2026-10-11T00:00:00.000Z",
  )
})

// Opt in only against a disposable, empty LOCAL PostgreSQL database named
// profile_subscription_sync_test, accessible to the local postgres role.
// Set PROFILE_SUBSCRIPTION_SQL_TEST=1; optionally PROFILE_SUBSCRIPTION_TEST_PORT.
// Never load .env files or accept connection URLs, host overrides, or passwords.
test("isolated PostgreSQL fixtures exercise the actual migration", {
  skip: process.env.PROFILE_SUBSCRIPTION_SQL_TEST !== "1"
    ? "opt in with PROFILE_SUBSCRIPTION_SQL_TEST=1 on a disposable local PostgreSQL database"
    : false,
}, () => {
  const port = process.env.PROFILE_SUBSCRIPTION_TEST_PORT ?? "5432"
  assert.match(port, /^[0-9]{1,5}$/)
  assert.ok(Number(port) > 0 && Number(port) <= 65535)
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith("PG")))
  const result = spawnSync("psql", [
    "-X", "--no-password", "--host=127.0.0.1", `--port=${port}`,
    "--username=postgres", "--dbname=profile_subscription_sync_test",
    "--set=ON_ERROR_STOP=1", "--file",
    fileURLToPath(new URL("./profile-subscription-sync.integration.sql", import.meta.url)),
  ], { env, encoding: "utf8", timeout: 30_000 })
  assert.ifError(result.error)
  assert.equal(result.status, 0, result.stderr || "local PostgreSQL fixtures failed")
})