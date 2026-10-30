import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as plans from "../lib/plans.ts";
import * as modes from "../lib/recurring-mode.ts";

const source = readFileSync(new URL("../app/api/payment/recurring/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
async function invoke(options: { noSecret?: boolean; unauthorized?: boolean; noClaim?: boolean; claimError?: boolean;
  queueError?: boolean; networkError?: boolean; nonRecurring?: boolean; plan?: string; planType?: string } = {}) {
  let queueCalls = 0, charges = 0, claimCalls = 0;
  const requests: Array<Record<string, unknown>> = [];
  const row = { id: "subscription", order_id: "parent", plan: options.plan ?? (options.nonRecurring ? "forever" : "month"),
    plan_type: options.planType, rectoken: "synthetic-fixture-not-a-real-token", email: "fixture@example.test" };
  const query = { select() { return query; }, eq() { return query; }, not() { return query; }, lte() { return query; },
    then(resolve: (value: unknown) => unknown) { return Promise.resolve({ data: [row], error: null }).then(resolve); } };
  const client = { from() { return query; }, async rpc(name: string) {
    assert.equal(name, "claim_hutko_recurring_charge"); claimCalls++;
    return { data: options.noClaim ? null : "renew_unique_period", error: options.claimError ? { message: "fixture failure" } : null };
  } };
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) } },
    crypto, "@/lib/supabase": { createAdminClient: () => client }, "@/lib/plans": plans, "@/lib/recurring-mode": modes,
    "@/lib/hutko": { stopHutkoSubscription: async () => { assert.fail("No live provider stop in cron tests"); } },
    "@/lib/unlimited-subscriptions": { runSubscriptionCancellationJobs: async () => {
      queueCalls++; if (options.queueError) throw new Error("mock queue failure"); return { completed: 1 };
    } },
  };
  const exports: { GET?: (request: unknown) => Promise<Response> } = {};
  runInNewContext(compiled, {
    exports, process: { env: { CRON_SECRET: options.noSecret ? "" : "synthetic-cron-fixture",
      NEXT_PUBLIC_SITE_URL: "https://example.test", HUTKO_MERCHANT_ID: "1", HUTKO_MERCHANT_PASSWORD: "synthetic-signing-fixture" } },
    console: { log() {}, error() {} }, AbortSignal,
    require(name: string) { assert.ok(name in modules, name); return modules[name]; },
    fetch: async (_url: string, init: { body: string }) => { charges++; requests.push(JSON.parse(init.body).request);
      if (options.networkError) throw new Error("mock timeout");
      return { json: async () => ({ response: { order_status: "approved" } }) }; },
  });
  const response = await exports.GET!({ headers: { get: () => options.unauthorized ? "" : "Bearer synthetic-cron-fixture" } });
  return { response, body: await response.json(), queueCalls, charges, claimCalls, requests };
}

test("missing/invalid cron authorization cannot cancel or charge", async () => {
  for (const options of [{ noSecret: true }, { unauthorized: true }]) {
    const result = await invoke(options);
    assert.equal(result.response.status, options.noSecret ? 503 : 401);
    assert.equal(result.queueCalls + result.charges + result.claimCalls, 0);
  }
});
test("queue failure pauses billing instead of silently dropping stop intents", async () => {
  const result = await invoke({ queueError: true });
  assert.equal(result.response.status, 503); assert.equal(result.charges, 0);
});
test("unlimited/cancelled/already-claimed subscription never issues a charge", async () => {
  const result = await invoke({ noClaim: true });
  assert.equal(result.queueCalls, 1); assert.equal(result.claimCalls, 1); assert.equal(result.charges, 0);
  assert.equal(result.body.results[0].status, "skipped_unlimited_cancelled_or_claimed");
});
test("billing claim failure and non-recurring plans fail closed", async () => {
  const failed = await invoke({ claimError: true });
  assert.equal(failed.response.status, 503); assert.equal(failed.charges, 0);
  const unlimited = await invoke({ nonRecurring: true });
  assert.equal(unlimited.claimCalls, 0); assert.equal(unlimited.charges, 0);
});
test("successful claimed billing waits for callback, ambiguous timeout requires reconciliation", async () => {
  const success = await invoke();
  assert.equal(success.charges, 1); assert.equal(success.body.results[0].status, "approved_waiting_callback");
  const timeout = await invoke({ networkError: true });
  assert.equal(timeout.charges, 1); assert.equal(timeout.body.results[0].status, "needs_provider_reconciliation");
});
test("club renewal charges 249000 from code, keyed by plan 'club' (plan_type 'year')", async () => {
  const result = await invoke({ plan: "club", planType: "year" });
  assert.equal(result.charges, 1);
  assert.equal(result.requests[0].amount, 249000);
  assert.equal(JSON.parse(String(result.requests[0].merchant_data)).plan, "club");
  assert.equal(result.body.results[0].status, "approved_waiting_callback");
});
test("month is off sale but monthly subscribers still renew at 10000", async () => {
  assert.equal(plans.isPlanPurchasable("month"), false);
  const result = await invoke({ plan: "month", planType: "month" });
  assert.equal(result.charges, 1);
  assert.equal(result.requests[0].amount, 10000);
});
test("every recurring plan renews at its configured amount", async () => {
  for (const id of plans.PLAN_IDS.filter((planId) => plans.PLAN_CONFIG[planId].isRecurring)) {
    const result = await invoke({ plan: id, planType: plans.PLAN_CONFIG[id].planType });
    assert.equal(result.requests[0].amount, plans.getPlanRenewalAmount(id), id);
  }
});

// SQL contract: the new migrations only add 'club' to the plan whitelists of 2026101402.
const queueMigration = readFileSync(new URL("../supabase/migrations/2026101402_queue_unlimited_cancellations.sql", import.meta.url), "utf8");
function sqlFunction(sql: string, name: string) {
  const match = sql.match(new RegExp(`CREATE (?:OR REPLACE )?FUNCTION public\\.${name}\\([\\s\\S]*?\\n\\$\\$;`));
  assert.ok(match, `${name} not found`);
  return { raw: match[0], normalized: match[0].replace(/^CREATE (OR REPLACE )?FUNCTION/, "CREATE FUNCTION") };
}
for (const [file, name, lists] of [
  ["2026102901_allow_club_recurring_charge.sql", "claim_hutko_recurring_charge", 1],
  ["2026102902_cancel_club_on_unlimited_access.sql", "queue_cancellations_on_unlimited_access", 2],
] as const) {
  test(`${file} replaces ${name} with only 'club' added`, () => {
    const migration = readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), "utf8");
    const replaced = sqlFunction(migration, name);
    const original = sqlFunction(queueMigration, name);
    assert.equal(replaced.normalized.split("'month', 'quarter', 'half', 'year', 'club')").length - 1, lists);
    assert.equal(replaced.normalized.replaceAll("'year', 'club')", "'year')"), original.normalized);
    assert.match(replaced.raw, /^CREATE OR REPLACE FUNCTION/);
    // Outside the function body: comments and privileges only, no data or schema changes.
    const outside = migration.replace(replaced.raw, "");
    assert.doesNotMatch(outside, /\b(UPDATE|INSERT|DELETE|ALTER|DROP|TRUNCATE|CREATE)\b/);
    assert.doesNotMatch(outside, /GRANT .* TO (anon|authenticated)/);
  });
}
