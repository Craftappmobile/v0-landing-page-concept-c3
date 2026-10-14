import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runSubscriptionCancellationJobs } from "../lib/unlimited-subscriptions.ts";

type Row = Record<string, unknown>;
const now = new Date("2026-10-14T12:00:00Z");
function fixture(overrides: Row = {}) {
  const candidate: Row = {
    id: "subscription", order_id: "parent", plan: "month", plan_type: "month",
    status: "active", payment_provider: "hutko", auto_renewal: false,
    recurring_mode: "hutko_schedule", recurring_mode_source: "hutko",
    cancellation_state: "requested", cancellation_request_id: "request", ...overrides,
  };
  const claimed = { subscription_id: "subscription", request_id: "request", claim_token: "lease", revision: 1, attempts: 1 };
  const job: Row = { ...claimed, state: "processing" };
  const tables: Record<string, Row[]> = {
    subscriptions: [candidate], subscription_cancellation_jobs: [job],
    payment_callback_events: [], subscription_cancellation_events: [],
  };
  const control = { claimError: false, finishError: false };
  const client = {
    async rpc(name: string) {
      assert.equal(name, "claim_subscription_cancellation_jobs");
      return { data: [claimed], error: control.claimError ? { message: "fixture failure" } : null };
    },
    from(table: string) {
      const filters: Array<(row: Row) => boolean> = [];
      let values: Row | undefined;
      const execute = () => {
        if (table === "subscription_cancellation_jobs" && control.finishError) return { data: [], error: { message: "fixture error" } };
        const rows = tables[table].filter((row) => filters.every((predicate) => predicate(row)));
        if (values) rows.forEach((row) => Object.assign(row, values));
        return { data: rows.map((row) => ({ ...row })), error: null };
      };
      const query = {
        select() { return query; },
        update(update: Row) { values = update; return query; },
        eq(column: string, value: unknown) { filters.push((row) => row[column] === value); return query; },
        is(column: string, value: unknown) { filters.push((row) => (row[column] ?? null) === value); return query; },
        in(column: string, list: unknown[]) { filters.push((row) => list.includes(row[column])); return query; },
        like() { return query; }, gt() { return query; }, order() { return query; }, limit() { return query; },
        async maybeSingle() { const result = execute(); return { ...result, data: result.data[0] ?? null }; },
        async upsert(values: Row) { tables[table].push(values); return { error: null }; },
        then(resolve: (value: ReturnType<typeof execute>) => unknown) { return Promise.resolve(execute()).then(resolve); },
      };
      return query;
    },
  };
  return { candidate, job, tables, control, client: client as never };
}

test("durable unlimited cancellation stops the schedule before completing the job", async () => {
  const db = fixture();
  let stops = 0;
  const summary = await runSubscriptionCancellationJobs({ supabase: db.client, now, stopProvider: async (order) => {
    assert.equal(order, "parent"); assert.equal(db.job.state, "processing");
    assert.equal(db.candidate.cancellation_state, "requested"); stops++;
  } });
  assert.equal(stops, 1);
  assert.equal(summary.completed, 1);
  assert.equal(db.job.state, "completed");
  assert.equal(db.candidate.cancellation_state, "completed");
  assert.equal(db.job.claim_token, null);
});

test("provider timeout keeps cancellation retryable and never falsely completes", async () => {
  const db = fixture();
  const summary = await runSubscriptionCancellationJobs({ supabase: db.client, now, stopProvider: async () => { throw new Error("mock timeout"); } });
  assert.equal(summary.retry, 1);
  assert.equal(db.job.state, "pending");
  assert.equal(db.job.last_error_code, "hutko_stop_failed");
  assert.ok(Date.parse(String(db.job.next_attempt_at)) > now.getTime());
  assert.equal(db.candidate.cancellation_state, "provider_failed");
});

test("unproved legacy none enters review without issuing any provider operation", async () => {
  const db = fixture({ recurring_mode: "none", recurring_mode_source: "auto_renewal_disabled" });
  const summary = await runSubscriptionCancellationJobs({ supabase: db.client, now, stopProvider: async () => { assert.fail("Unproved provider operation"); } });
  assert.equal(summary.needsReview, 1);
  assert.equal(db.job.state, "needs_review");
  assert.equal(db.candidate.cancellation_state, "needs_review");
});

test("merchant-token cancellation only disables local billing; lifetime is never mutated", async () => {
  for (const overrides of [{ recurring_mode: "merchant_token", recurring_mode_source: "application" },
    { plan: null, plan_type: "lifetime", payment_provider: "manual", recurring_mode: "none" }]) {
    const db = fixture(overrides);
    const before = { ...db.candidate };
    await runSubscriptionCancellationJobs({ supabase: db.client, now, stopProvider: async () => { assert.fail("No provider schedule"); } });
    assert.equal(db.job.state, "completed");
    if (overrides.plan_type === "lifetime") assert.deepEqual(db.candidate, before);
  }
});

test("a re-enqueued revision cannot be completed by a stale worker lease", async () => {
  const db = fixture();
  const summary = await runSubscriptionCancellationJobs({ supabase: db.client, now, stopProvider: async () => {
    Object.assign(db.job, { revision: 2, state: "pending", claim_token: null });
  } });
  assert.equal(summary.superseded, 1);
  assert.equal(db.job.state, "pending");
});

test("queue database failure fails closed and never calls the provider", async () => {
  const db = fixture(); db.control.claimError = true;
  await assert.rejects(runSubscriptionCancellationJobs({ supabase: db.client, now,
    stopProvider: async () => { assert.fail("No claim"); } }), /claim failed/);
});

test("queue completion failure leaves its lease recoverable without repeating a confirmed stop", async () => {
  const db = fixture(); db.control.finishError = true;
  let stops = 0;
  await assert.rejects(runSubscriptionCancellationJobs({ supabase: db.client, now,
    stopProvider: async () => { stops++; } }), /completion failed/);
  assert.equal(db.job.state, "processing");
  assert.equal(db.candidate.cancellation_state, "completed");
  db.control.finishError = false;
  const retry = await runSubscriptionCancellationJobs({ supabase: db.client, now,
    stopProvider: async () => { stops++; } });
  assert.equal(stops, 1);
  assert.equal(retry.completed, 1);
});

test("pending checkout keeps a retryable job without claiming a schedule was stopped", async () => {
  const db = fixture({ status: "pending" });
  const summary = await runSubscriptionCancellationJobs({ supabase: db.client, now,
    stopProvider: async () => { assert.fail("Checkout is not activated"); } });
  assert.equal(summary.retry, 1);
  assert.equal(db.job.last_error_code, "pending_activation");
  assert.equal(db.candidate.cancellation_state, "requested");
});

test("SQL queue is private, atomically leased, and sees lifetime grants from AFTER triggers", () => {
  const sql = readFileSync(new URL("../supabase/migrations/2026101402_queue_unlimited_cancellations.sql", import.meta.url), "utf8");
  assert.match(sql, /RETURNS UUID LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = ''/);
  assert.match(sql, /FOR UPDATE SKIP LOCKED/);
  assert.match(sql, /locked_until < now\(\)/);
  assert.match(sql, /claim_token = gen_random_uuid\(\)/);
  assert.match(sql, /revision = j.revision \+ 1/);
  assert.match(sql, /NEW.status = 'active'/);
  assert.match(sql, /AFTER INSERT OR UPDATE OF status, user_id, email, plan, plan_type, expires_at/);
  assert.match(sql, /s.user_id IS NULL AND NULLIF\(i.email, ''\) IS NOT NULL/);
  assert.match(sql, /PRIMARY KEY \(subscription_id, period_end\)/);
  assert.match(sql, /ON CONFLICT \(subscription_id, period_end\) DO NOTHING/);
  assert.match(sql, /cancellation_state IS DISTINCT FROM 'none'/);
  assert.match(sql, /v_target.status IS DISTINCT FROM 'active'/);
  assert.match(sql, /v_target.recurring_mode IS DISTINCT FROM 'merchant_token'/);
  for (const table of ["subscription_cancellation_jobs", "subscription_charge_claims"]) {
    assert.ok(sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`));
    assert.ok(sql.includes(`REVOKE ALL ON TABLE public.${table} FROM PUBLIC, anon, authenticated`));
  }
});