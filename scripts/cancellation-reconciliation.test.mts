import assert from "node:assert/strict";
import test from "node:test";
import type { CancellableSubscription } from "../lib/cancel-subscription.ts";
import { findCancellationSubscriptions, reconcileSubscriptionCancellation } from "../lib/cancellation-reconciliation.ts";
import { cancelOneSubscription } from "../lib/subscription-cancellation.ts";

const requestId = "11111111-1111-4111-8111-111111111111";
const now = "2026-10-14T12:00:00.000Z";
type Row = Record<string, unknown>;

function subscription(overrides: Partial<CancellableSubscription> & Row = {}): CancellableSubscription & Row {
  return {
    id: "legacy-month", order_id: "Order_parent_123", user_id: "account-1", email: null,
    plan: "month", plan_type: "month", customer_name: null, payment_provider: "hutko",
    recurring_mode: "none", recurring_mode_source: "auto_renewal_disabled", auto_renewal: false,
    status: "active", cancellation_state: "none", cancellation_request_id: null,
    cancellation_completed_at: null, ...overrides,
  };
}

function renewal(overrides: Row = {}): Row {
  return {
    provider: "hutko", event_type: "renewal_approved", reason: "renewal_applied",
    order_id: "recurring__attempt__Order_parent_123", merchant_order_id: "Order_parent_123",
    order_status: "approved", received_at: "2026-10-13T15:15:49.000Z", ...overrides,
  };
}

function matchesLike(value: unknown, pattern: string): boolean {
  let source = "^";
  const literal = (char: string) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "\\") source += literal(pattern[++index] || "\\");
    else source += char === "%" ? ".*" : char === "_" ? "." : literal(char);
  }
  return new RegExp(`${source}$`).test(String(value ?? ""));
}

/** In-memory PostgREST subset. Never constructs a real Supabase client or provider request. */
function database(candidate = subscription(), callbacks: Row[] = []) {
  const tables: Record<string, Row[]> = {
    subscriptions: [{ ...candidate }], payment_callback_events: callbacks,
    profiles: [], subscription_cancellation_events: [],
  };
  const writes: Array<{ table: string; values: Row }> = [];
  const reads: Array<{ table: string; columns: string }> = [];
  const markers: string[] = [];
  const state = { failEvidence: false, conflict: false };
  const client = {
    from(table: string) {
      const predicates: Array<(row: Row) => boolean> = [];
      let values: Row | undefined;
      let max = Infinity;
      const execute = () => {
        if (table === "payment_callback_events" && state.failEvidence) {
          return { data: [], error: { message: "mock lookup failure" } };
        }
        const rows = tables[table].filter((row) => predicates.every((predicate) => predicate(row))).slice(0, max);
        if (values && state.conflict && "recurring_mode_classified_at" in values) return { data: [], error: null };
        if (values) {
          writes.push({ table, values });
          markers.push(`db:${String(values.cancellation_state || "update")}`);
          rows.forEach((row) => Object.assign(row, values));
        }
        return { data: rows.map((row) => ({ ...row })), error: null };
      };
      const query = {
        select(columns: string) { reads.push({ table, columns }); return query; },
        update(update: Row) { values = update; return query; },
        eq(column: string, value: unknown) { predicates.push((row) => row[column] === value); return query; },
        is(column: string, value: unknown) { predicates.push((row) => (row[column] ?? null) === value); return query; },
        in(column: string, options: unknown[]) { predicates.push((row) => options.includes(row[column])); return query; },
        like(column: string, pattern: string) { predicates.push((row) => matchesLike(row[column], pattern)); return query; },
        ilike(column: string, pattern: string) {
          predicates.push((row) => matchesLike(String(row[column] ?? "").toLowerCase(), pattern.toLowerCase()));
          return query;
        },
        gt(column: string, value: string) {
          predicates.push((row) => Date.parse(String(row[column])) > Date.parse(value)); return query;
        },
        order() { return query; },
        limit(value: number) { max = value; return query; },
        async maybeSingle() { const result = execute(); return { ...result, data: result.data[0] || null }; },
        async upsert(event: Row) { tables[table].push(event); return { error: null }; },
        then(resolve: (result: ReturnType<typeof execute>) => unknown, reject?: (error: unknown) => unknown) {
          return Promise.resolve(execute()).then(resolve, reject);
        },
      };
      return query;
    },
  };
  return { tables, writes, reads, markers, state, client: client as never };
}

test("incident: disabled month is found by account and stopped using callback parent without emails", async () => {
  const candidate = subscription();
  const db = database(candidate, [renewal()]);
  db.tables.profiles.push({ id: "account-1", email: "owner@example.test" });
  db.tables.subscriptions.push(subscription({ id: "unlimited", plan: null, plan_type: "lifetime",
    payment_provider: "manual", order_id: null, recurring_mode_source: null }));
  const candidates = await findCancellationSubscriptions({ supabase: db.client, emailPattern: "owner@example.test", requestId });
  assert.deepEqual(candidates.map((row) => row.id), [candidate.id]);
  const stops: string[] = [];
  const result = await cancelOneSubscription({
    supabase: db.client, subscription: candidates[0], requestId, now,
    stopProvider: async (order) => { stops.push(order); db.markers.push("provider:stop"); },
  });
  assert.equal(result.outcome, "completed");
  assert.deepEqual(stops, [candidate.order_id]);
  assert.ok(db.markers.indexOf("provider:stop") < db.markers.indexOf("db:completed"));
  assert.ok(db.writes.some(({ values }) => values.recurring_mode_source === "legacy_recurring_callback"));
  assert.equal(db.tables.subscriptions[1].cancellation_state, "none");
  assert.equal(db.reads.some((read) => read.table === "payment_callback_events" && /email|rectoken|payload/.test(read.columns)), false);
});

test("lookup follows email subscription user_id, deduplicates, and never excludes a disabled Hutko row", async () => {
  const db = database(subscription({ email: "OWNER@example.test" }));
  db.tables.subscriptions.push(subscription({ id: "other-parent", order_id: "another", email: null }));
  const rows = await findCancellationSubscriptions({ supabase: db.client, emailPattern: "owner@example.test", requestId });
  assert.deepEqual(rows.map((row) => row.id), ["legacy-month", "other-parent"]);
});

test("a local expired or cancelled status is not proof that Hutko stopped its schedule", async () => {
  for (const status of ["expired", "cancelled"]) {
    const candidate = subscription({ status, email: "owner@example.test" });
    const db = database(candidate, [renewal()]);
    const rows = await findCancellationSubscriptions({ supabase: db.client, emailPattern: "owner@example.test", requestId });
    assert.equal(rows.length, 1);
    const result = await cancelOneSubscription({ supabase: db.client, subscription: rows[0], requestId, now,
      stopProvider: async (order) => { assert.equal(order, candidate.order_id); } });
    assert.equal(result.providerStopped, true);
  }
});

test("genuine lifetime and forever are excluded and reconciliation never mutates them", async () => {
  for (const fields of [{ plan: "forever" }, { plan: null, plan_type: "lifetime", payment_provider: "manual" }]) {
    const candidate = subscription({ ...fields, email: "owner@example.test" });
    const db = database(candidate, [renewal()]);
    assert.deepEqual(await findCancellationSubscriptions({ supabase: db.client, emailPattern: "owner@example.test", requestId }), []);
    const before = db.reads.length;
    assert.equal(await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now }), candidate);
    assert.equal(db.reads.length, before);
    assert.deepEqual(db.writes, []);
  }
});

test("unknown pending/failed and local none without evidence remain manual review; rectoken proves nothing", async () => {
  for (const fields of [
    { recurring_mode: "unknown", status: "pending" }, { recurring_mode: "unknown", status: "failed" },
    { recurring_mode: null, status: "pending" }, {},
  ]) {
    const candidate = subscription({ ...fields, rectoken: "mock-token-not-driver-evidence" });
    const db = database(candidate);
    const result = await cancelOneSubscription({ supabase: db.client, subscription: candidate, requestId, now,
      stopProvider: async () => { assert.fail("unproved schedule must not be stopped"); } });
    assert.equal(result.outcome, "manual_review");
    assert.equal(db.tables.subscriptions[0].cancellation_state, "needs_review");
    assert.equal(db.writes.some(({ values }) => values.recurring_mode === "hutko_schedule" || values.cancellation_state === "completed"), false);
  }
});

test("explicit hutko source proves driver without using a token or callback email", async () => {
  const candidate = subscription({ recurring_mode: "unknown", recurring_mode_source: "hutko" });
  const db = database(candidate);
  const resolved = await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now });
  assert.equal(resolved.recurring_mode, "hutko_schedule");
  assert.equal(resolved.recurring_mode_source, "hutko");
  assert.equal(db.writes.length, 1);
});

test("callback matching requires exact parent, trusted event type, provider and approved status", async () => {
  for (const event of [
    renewal({ order_id: "recurring__attempt__prefix__Order_parent_123" }),
    renewal({ merchant_order_id: "different-parent" }), renewal({ provider: "other" }),
    renewal({ order_status: "declined" }), renewal({ event_type: "unverified" }),
    renewal({ reason: "unverified" }),
  ]) {
    const candidate = subscription();
    const db = database(candidate, [event]);
    assert.equal(await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now }), candidate);
    assert.deepEqual(db.writes, []);
  }
});

test("exact legacy parent can be established from signed order id alone", async () => {
  const candidate = subscription();
  const db = database(candidate, [renewal({ merchant_order_id: null })]);
  const resolved = await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now });
  assert.equal(resolved.recurring_mode, "hutko_schedule");
});

test("post-unlimited and post-cancellation anomaly audits still prove a legacy schedule", async () => {
  for (const reason of ["renewal_after_unlimited", "renewal_after_cancellation"]) {
    const candidate = subscription();
    const db = database(candidate, [renewal({ reason })]);
    const resolved = await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now });
    assert.equal(resolved.recurring_mode, "hutko_schedule");
    assert.equal(resolved.recurring_mode_source, "legacy_recurring_callback");
  }
});

test("LIKE metacharacters in the parent are escaped, not expanded", async () => {
  const candidate = subscription({ order_id: "parent_%literal" });
  const db = database(candidate, [renewal({ order_id: "recurring__1__parent_%literal", merchant_order_id: "parent_%literal" })]);
  assert.equal((await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now })).recurring_mode, "hutko_schedule");
});

test("verified schedule evidence on a pending row requires stop, not pending activation", async () => {
  const candidate = subscription({ status: "pending", recurring_mode: "unknown" });
  const db = database(candidate, [renewal()]);
  let stops = 0;
  const result = await cancelOneSubscription({ supabase: db.client, subscription: candidate, requestId, now,
    stopProvider: async () => { stops += 1; } });
  assert.equal(stops, 1);
  assert.equal(result.outcome, "completed");
});

test("incident timeout remains retryable; successful retry and completed replay preserve the request", async () => {
  const candidate = subscription();
  const db = database(candidate, [renewal()]);
  const failed = await cancelOneSubscription({ supabase: db.client, subscription: candidate, requestId, now,
    stopProvider: async () => { throw new DOMException("mock timeout", "TimeoutError"); } });
  assert.equal(failed.outcome, "provider_failed");
  assert.equal(db.tables.subscriptions[0].cancellation_completed_at, null);
  assert.equal(db.writes.some(({ values }) => values.cancellation_state === "completed"), false);
  const retried = await cancelOneSubscription({ supabase: db.client,
    subscription: { ...db.tables.subscriptions[0] } as CancellableSubscription, requestId: "new-request", now,
    stopProvider: async () => undefined });
  assert.equal(retried.outcome, "completed");
  assert.equal(retried.requestId, requestId);
  const before = db.writes.length;
  const replay = await cancelOneSubscription({ supabase: db.client,
    subscription: { ...db.tables.subscriptions[0] } as CancellableSubscription, requestId: "new-request", now,
    stopProvider: async () => { assert.fail("completed replay must not stop twice"); } });
  assert.equal(replay.outcome, "completed");
  assert.equal(db.writes.length, before);
});

test("explicit completion is trusted without provably newer callback evidence", async () => {
  for (const completedAt of [null, "2026-10-14T00:00:00.000Z"]) {
    const candidate = subscription({ cancellation_state: "completed", cancellation_completed_at: completedAt });
    const db = database(candidate, [renewal()]);
    const resolved = await reconcileSubscriptionCancellation({ supabase: db.client, subscription: candidate, now });
    assert.equal(resolved, candidate);
    assert.deepEqual(db.writes, []);
  }
});

test("newer verified late renewal reopens a completed cancellation and stops again", async () => {
  const candidate = subscription({ cancellation_state: "completed", cancellation_request_id: requestId,
    cancellation_completed_at: "2026-10-01T00:00:00.000Z", recurring_mode_source: "cancelled_hutko_schedule" });
  const db = database(candidate, [renewal()]);
  const stops: string[] = [];
  const result = await cancelOneSubscription({ supabase: db.client, subscription: candidate, requestId, now,
    stopProvider: async (order) => { stops.push(order); db.markers.push("provider:stop"); } });
  assert.equal(result.outcome, "completed");
  assert.deepEqual(stops, [candidate.order_id]);
  assert.equal(db.writes[0].values.cancellation_completed_at, null);
  assert.ok(db.markers.indexOf("provider:stop") < db.markers.indexOf("db:completed"));
});

test("evidence lookup failure or concurrent reconciliation fails closed before provider stop", async () => {
  for (const fault of ["failEvidence", "conflict"] as const) {
    const candidate = subscription();
    const db = database(candidate, [renewal()]);
    db.state[fault] = true;
    await assert.rejects(cancelOneSubscription({ supabase: db.client, subscription: candidate, requestId, now,
      stopProvider: async () => { assert.fail("failed reconciliation must not stop"); } }), /Cancellation/);
    assert.equal(db.tables.subscriptions[0].cancellation_state, "none");
    assert.equal(db.writes.length, 0);
  }
});