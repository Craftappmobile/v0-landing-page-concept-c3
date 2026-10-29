// Offline only: mocked callback execution and SQL source-contract checks.
// Run: node --no-warnings --experimental-strip-types --test scripts/renewal-safety.test.mts
// These checks do not execute SQL, load environment files or call a provider.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as plans from "../lib/plans.ts";
import * as paymentFlow from "../lib/payment-flow.ts";
import * as recurringMode from "../lib/recurring-mode.ts";
import * as emailValidation from "../lib/email-validation.ts";

const callback = readFileSync(new URL("../app/api/payment/callback/route.ts", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/migrations/2026101403_guard_unlimited_renewals.sql", import.meta.url), "utf8");
const originalMigration = readFileSync(new URL("../supabase/migrations/20260830_add_subscription_cancellation_state.sql", import.meta.url), "utf8");
const compiled = ts.transpileModule(callback, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

type Row = Record<string, unknown>;
type Write = { table: string; operation: string; values: Row };
const fixture: Row = {
  id: "00000000-0000-4000-8000-000000000001",
  order_id: "parent_order", email: "subscriber@example.com", customer_name: "Subscriber",
  plan: "month", plan_type: "month", status: "active", email_status: "sent",
  expires_at: "2030-01-01T00:00:00.000Z", auto_renewal: false,
  recurring_mode: "none", cancellation_state: "completed",
  cancellation_request_id: "00000000-0000-4000-8000-000000000002",
};

async function invoke(options: {
  subscription?: Row;
  renewalResult?: string | null;
  rpcError?: boolean;
  auditError?: boolean;
  body?: Row;
} = {}) {
  const writes: Write[] = [];
  const rpcs: Array<{ name: string; args: Row }> = [];
  const providerStops: Row[] = [];
  const welcomePlans: unknown[] = [];
  let emails = 0;
  // All fluent operations terminate in local fixtures, never a Supabase client.
  const client = {
    from(table: string) {
      const result = { data: options.subscription ?? fixture, error: null };
      const query = {
        select() { return query; },
        eq() { return query; },
        maybeSingle: async () => result,
        update(values: Row) { writes.push({ table, operation: "update", values }); return query; },
        upsert(values: Row) { writes.push({ table, operation: "upsert", values }); return query; },
        async insert(values: Row) {
          writes.push({ table, operation: "insert", values });
          return { error: options.auditError ? { message: "fixture audit failure" } : null };
        },
        then(resolve: (value: typeof result) => unknown) { return Promise.resolve(result).then(resolve); },
      };
      return query;
    },
    async rpc(name: string, args: Row) {
      rpcs.push({ name, args });
      if (name === "find_paid_auth_user_by_email") return { data: fixture.id, error: null };
      assert.equal(name, "apply_hutko_renewal");
      return {
        data: options.renewalResult === null ? [] : [{
          result: options.renewalResult ?? "review_required", subscription_id: fixture.id,
          cancellation_state: "completed", cancellation_request_id: fixture.cancellation_request_id,
          recurring_mode: "hutko_schedule", recurring_mode_source: "cancelled_hutko_schedule",
        }],
        error: options.rpcError ? { message: "fixture RPC failure" } : null,
      };
    },
  };
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) } },
    crypto,
    "@/lib/supabase": { createAdminClient: () => client },
    "@/lib/plans": plans,
    "@/lib/payment-flow": paymentFlow,
    "@/lib/recurring-mode": recurringMode,
    "@/lib/email-validation": emailValidation,
    "@/lib/password": { generateSecurePassword: () => { throw new Error("Unexpected Auth creation"); } },
    "@/lib/email": {
      sendWelcomeEmail: async (...args: unknown[]) => { emails++; welcomePlans.push(args[2]); return { success: true }; },
      sendRenewalFailedEmail: async () => { throw new Error("Unexpected failure email"); },
    },
    "@/lib/hutko": { stopHutkoSubscription: async (args: Row) => { providerStops.push(args); } },
  };
  const exports: { POST?: (request: { json: () => Promise<Row> }) => Promise<Response> } = {};
  runInNewContext(compiled, {
    exports, process: { env: {} },
    console: { log() {}, warn() {}, error() {} },
    require(name: string) { assert.ok(name in modules, `Unexpected import: ${name}`); return modules[name]; },
    fetch: () => { throw new Error("Network is forbidden in renewal safety tests"); },
  });
  const body: Row = {
    order_id: "recurring__1__parent_order", order_status: "approved", payment_id: "fixture_payment",
    amount: "10000", currency: "UAH", ...options.body,
  };
  const values = Object.keys(body).sort().map((key) => {
    const value = body[key];
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  });
  // The sandbox has no credentials; sign using its deliberately empty env.
  body.signature = crypto.createHash("sha1").update(["", ...values].join("|")).digest("hex");
  assert.ok(exports.POST);
  const response = await exports.POST({ json: async () => body });
  return { response, body: await response.json(), writes, rpcs, providerStops, emails, welcomePlans };
}

test("renewal review commits via one RPC and never stops Hutko in the callback", async () => {
  const result = await invoke();
  assert.equal(result.response.status, 200);
  assert.equal(result.body.status, "manual_review");
  assert.equal(result.rpcs.length, 1);
  assert.equal(result.rpcs[0].args.p_duration_days, null);
  assert.equal(result.writes.length, 0);
  assert.equal(result.providerStops.length, 0);
  assert.equal(result.emails, 0);
});

for (const renewalResult of ["applied", "duplicate"]) {
  test(`${renewalResult} renewal never repeats cancellation or provisioning`, async () => {
    const result = await invoke({ renewalResult });
    assert.equal(result.body.status, "ok");
    assert.equal(result.writes.length, 0);
    assert.equal(result.providerStops.length, 0);
    assert.equal(result.emails, 0);
  });
}

test("missing, unknown and failed renewal RPC results fail closed", async () => {
  for (const options of [{ renewalResult: null }, { renewalResult: "unexpected" }, { rpcError: true }]) {
    const result = await invoke(options);
    assert.equal(result.response.status, 500);
    assert.equal(result.providerStops.length, 0);
    assert.equal(result.writes.length, 0);
  }
});

test("missing parent is acknowledged only after the review audit succeeds", async () => {
  for (const auditError of [false, true]) {
    const result = await invoke({ renewalResult: "parent_not_found", auditError });
    assert.equal(result.response.status, auditError ? 500 : 200);
    assert.equal(result.writes[0].table, "payment_callback_events");
    assert.equal(result.writes[0].values.reason, "renewal_parent_not_found");
    assert.equal(result.providerStops.length, 0);
  }
});

test("active initial approval replay preserves cancelled billing and all paid access", async () => {
  const result = await invoke({ body: { order_id: fixture.order_id, merchant_data: { plan: "year" } } });
  assert.equal(result.body.status, "ok");
  assert.equal(result.writes.length, 0);
  assert.equal(result.rpcs.length, 0);
  assert.equal(result.providerStops.length, 0);
  assert.equal(result.emails, 0);
});

test("active approval replay retries unsent welcome without access or profile writes", async () => {
  const result = await invoke({ subscription: { ...fixture, email_status: "failed" }, body: { order_id: fixture.order_id } });
  assert.equal(result.body.status, "ok");
  assert.equal(result.emails, 1);
  assert.deepEqual(result.rpcs.map((rpc) => rpc.name), ["find_paid_auth_user_by_email"]);
  assert.equal(result.providerStops.length, 0);
  assert.ok(result.writes.length > 0);
  for (const write of result.writes) {
    assert.equal(write.table, "subscriptions");
    assert.ok(Object.keys(write.values).every((key) => ["user_id", "email_status", "email_error"].includes(key)));
  }
});

for (const plan of plans.PLAN_IDS) {
  test(`initial ${plan} approval uses the stored plan's initial duration without callback metadata`, async () => {
    // Rows as /api/payment/create writes them: club is plan 'club', plan_type 'year'.
    const planType = plans.PLAN_CONFIG[plan].planType;
    const result = await invoke({
      subscription: { ...fixture, plan, plan_type: planType, status: "pending", auto_renewal: plans.PLAN_CONFIG[plan].isRecurring, cancellation_state: "none" },
      body: { order_id: fixture.order_id },
    });
    assert.equal(result.body.status, "ok");
    const activation = result.writes.find((write) => write.values.status === "active");
    assert.ok(activation);
    const start = new Date(String(activation.values.started_at));
    start.setDate(start.getDate() + plans.getPlanInitialAccessDays(plan));
    assert.equal(activation.values.expires_at, start.toISOString());
    assert.equal(activation.values.auto_renewal, plans.PLAN_CONFIG[plan].isRecurring);
    // Activation never rewrites the package: a club must not become plan 'year'.
    for (const write of result.writes) {
      assert.equal("plan" in write.values, false);
      assert.equal("plan_type" in write.values, false);
    }
    assert.deepEqual(result.welcomePlans, [plan]);
    assert.equal(result.providerStops.length, 0);
  });
}

test("initial club approval gives 365 days even when merchant_data names another plan", async () => {
  const result = await invoke({
    subscription: { ...fixture, plan: "club", plan_type: "year", status: "pending", auto_renewal: true, cancellation_state: "none" },
    body: { order_id: fixture.order_id, merchant_data: { plan: "year", plan_code: "12" } },
  });
  assert.equal(result.body.status, "ok");
  const activation = result.writes.find((write) => write.values.status === "active");
  assert.ok(activation);
  const start = new Date(String(activation.values.started_at));
  start.setDate(start.getDate() + 365);
  assert.equal(activation.values.expires_at, start.toISOString());
  assert.equal(activation.values.recurring_mode, "hutko_schedule");
  assert.deepEqual(result.welcomePlans, ["club"]);
});

test("initial pending cancellation still finalizes provider stop after approval", async () => {
  const result = await invoke({
    subscription: { ...fixture, status: "pending", cancellation_state: "requested" },
    body: { order_id: fixture.order_id },
  });
  assert.equal(result.body.status, "ok");
  assert.equal(result.providerStops.length, 1);
  assert.equal(result.providerStops[0].orderId, fixture.order_id);
});

test("CREATE OR REPLACE preserves the original complete RPC signature and return columns", () => {
  const header = (sql: string) => sql.match(/CREATE OR REPLACE FUNCTION public\.apply_hutko_renewal\([\s\S]*?AS \$\$/)?.[0].replace(/\s+/g, " ");
  assert.ok(header(migration));
  assert.equal(header(migration), header(originalMigration));
});

test("renewal durations come only from the canonical locked parent, never RPC hints", () => {
  assert.match(migration, /WHERE s\.order_id = p_parent_order_id\s+FOR UPDATE/);
  assert.match(migration, /COALESCE\(NULLIF\(btrim\(v_subscription\.plan_type::TEXT\)/);
  for (const plan of ["month", "quarter", "half", "year"] as const) {
    const days = migration.match(new RegExp(`WHEN '${plan}' THEN ([0-9]+)`));
    assert.equal(Number(days?.[1]), plans.getPlanRenewalAccessDays(plan));
  }
  assert.match(migration, /ELSE NULL END/);
  assert.match(migration, /IF v_lifetime THEN v_duration_days := NULL/);
  assert.match(migration, /make_interval\(days => v_duration_days\)/);
  assert.doesNotMatch(migration, /make_interval\(days => p_duration_days\)/);
});

test("audit claim and both duplicate returns precede classification, cancellation and extension", () => {
  const claim = migration.indexOf("INSERT INTO public.payment_callback_events");
  const classification = migration.indexOf("IF v_legacy_schedule THEN");
  const enqueue = migration.indexOf("PERFORM public.enqueue_subscription_cancellation");
  assert.ok(migration.indexOf("pg_advisory_xact_lock") < claim);
  assert.match(migration, /e\.hutko_payment_id = p_payment_id/);
  assert.match(migration, /ON CONFLICT \(dedupe_key\) DO NOTHING/);
  const duplicateReturns = [...migration.matchAll(/RETURN QUERY SELECT 'duplicate'/g)];
  assert.equal(duplicateReturns.length, 2);
  assert.ok(duplicateReturns.every((match) => match.index! < classification));
  assert.ok(claim < classification && classification < enqueue);
  assert.ok(enqueue < migration.indexOf("expires_at = GREATEST"));
});

test("anomalies are audited and queued without assigning access fields", () => {
  for (const reason of ["renewal_after_unlimited", "renewal_after_cancellation", "renewal_unknown_plan"]) {
    assert.ok(migration.includes(`'${reason}'`));
  }
  assert.match(migration, /public\.find_active_unlimited_subscription\(\s*v_subscription\.user_id, v_subscription\.email, p_now/);
  assert.match(migration, /v_subscription\.auto_renewal IS NOT TRUE/);
  assert.match(migration, /v_subscription\.cancellation_state IS DISTINCT FROM 'none'/);
  assert.match(migration, /v_subscription\.cancelled_at IS NOT NULL/);
  const anomaly = migration.slice(migration.indexOf("IF v_reason IS NOT NULL THEN"), migration.indexOf("SET status = 'active'"));
  assert.match(anomaly, /processing_status = 'needs_review'/);
  assert.match(anomaly, /IF v_recurring_target THEN/);
  assert.match(anomaly, /public\.enqueue_subscription_cancellation\(v_subscription\.id, v_unlimited_id\)/);
  assert.match(anomaly, /RETURN QUERY SELECT 'review_required'/);
  assert.doesNotMatch(anomaly, /\b(status|expires_at|started_at|plan|plan_type|user_id)\s*=/);
  assert.doesNotMatch(migration, /public\.profiles|http_post|net\./);
});

test("only a fresh exact legacy recurring parent reclassifies scheduling; renew_ retains its driver", () => {
  assert.match(migration, /regexp_replace\(p_callback_order_id, '\^recurring__\[\^_\]\+__', ''\) = p_parent_order_id/);
  assert.match(migration, /IF v_legacy_schedule THEN\s+UPDATE public\.subscriptions AS s\s+SET recurring_mode = 'hutko_schedule',\s+recurring_mode_source = 'legacy_recurring_callback'/);
  assert.match(migration, /v_recurring_target := NOT v_lifetime/);
  assert.doesNotMatch(migration, /recurring_mode = 'merchant_token'|auto_renewal = true/);
});

test("SQL accepts a delayed renewal after housekeeping expiry but still rejects cancelled access", () => {
  assert.match(migration, /COALESCE\(v_subscription.status, ''\) NOT IN \('active', 'expired'\)/);
  assert.match(migration, /v_subscription.status = 'cancelled'/);
  assert.match(migration, /v_subscription.cancelled_at IS NOT NULL/);
});

test("audit and renewal RPC remain service-only with no client policies", () => {
  assert.match(migration, /ALTER TABLE public\.payment_callback_events ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /REVOKE ALL ON TABLE public\.payment_callback_events FROM PUBLIC, anon, authenticated/);
  assert.match(migration, /GRANT ALL ON TABLE public\.payment_callback_events TO service_role/);
  assert.match(migration, /SECURITY INVOKER\s+SET search_path = ''/);
  assert.match(migration, /\) FROM PUBLIC, anon, authenticated/);
  assert.match(migration, /GRANT EXECUTE ON FUNCTION public\.apply_hutko_renewal\([\s\S]*?\) TO service_role/);
  assert.doesNotMatch(migration, /CREATE POLICY|GRANT .* TO (anon|authenticated)/);
});