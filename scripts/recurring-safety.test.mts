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
  queueError?: boolean; networkError?: boolean; nonRecurring?: boolean } = {}) {
  let queueCalls = 0, charges = 0, claimCalls = 0;
  const row = { id: "subscription", order_id: "parent", plan: options.nonRecurring ? "forever" : "month",
    rectoken: "synthetic-fixture-not-a-real-token", email: "fixture@example.test" };
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
    fetch: async () => { charges++; if (options.networkError) throw new Error("mock timeout");
      return { json: async () => ({ response: { order_status: "approved" } }) }; },
  });
  const response = await exports.GET!({ headers: { get: () => options.unauthorized ? "" : "Bearer synthetic-cron-fixture" } });
  return { response, body: await response.json(), queueCalls, charges, claimCalls };
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