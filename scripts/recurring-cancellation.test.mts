import assert from "node:assert/strict";
import test from "node:test";

import type { CancellableSubscription } from "../lib/cancel-subscription.ts";
import { cancelOneSubscription } from "../lib/subscription-cancellation.ts";

const requestId = "11111111-1111-4111-8111-111111111111";

function subscription(overrides: Partial<CancellableSubscription> = {}): CancellableSubscription {
  return {
    id: "subscription-1", order_id: "order-1", plan: "quarter", customer_name: null,
    payment_provider: "hutko", recurring_mode: "hutko_schedule", status: "active",
    auto_renewal: true, cancellation_state: "none", cancellation_request_id: null,
    ...overrides,
  };
}

function fakeSupabase(markers: string[] = []) {
  const updates: Array<Record<string, unknown>> = [];
  const events: Array<Record<string, unknown>> = [];
  return {
    updates,
    events,
    client: {
      from(table: string) {
        return {
          select() {
            const query = {
              eq() { return query; },
              in() { return query; },
              like() { return query; },
              gt() { return query; },
              order() { return query; },
              async limit() { return { data: [], error: null }; },
            };
            return query;
          },
          update(values: Record<string, unknown>) {
            return {
              async eq() {
                updates.push(values);
                markers.push(`db:${String(values.cancellation_state || "update")}`);
                return { error: null };
              },
            };
          },
          async upsert(values: Record<string, unknown>) {
            events.push({ table, ...values });
            return { error: null };
          },
        };
      },
    },
  };
}

test("provider stop is between intent and completed local state", async () => {
  const markers: string[] = [];
  const db = fakeSupabase(markers);
  const result = await cancelOneSubscription({
    supabase: db.client as never, subscription: subscription(), requestId,
    now: "2026-08-30T00:00:00.000Z",
    stopProvider: async () => { markers.push("provider:stopped"); },
  });

  assert.equal(result.outcome, "completed");
  assert.ok(markers.indexOf("db:requested") < markers.indexOf("provider:stopped"));
  assert.ok(markers.indexOf("provider:stopped") < markers.indexOf("db:completed"));
});

test("provider timeout stays retryable and never marks completed", async () => {
  const db = fakeSupabase();
  const result = await cancelOneSubscription({
    supabase: db.client as never, subscription: subscription(), requestId,
    now: "2026-08-30T00:00:00.000Z",
    stopProvider: async () => { throw new DOMException("timeout", "TimeoutError"); },
  });

  assert.equal(result.outcome, "provider_failed");
  assert.equal(db.updates.some((value) => value.cancellation_state === "completed"), false);
  assert.equal(db.updates.at(-1)?.cancellation_state, "provider_failed");
});

test("retry resumes provider_failed cancellation", async () => {
  const db = fakeSupabase();
  const result = await cancelOneSubscription({
    supabase: db.client as never,
    subscription: subscription({ cancellation_state: "provider_failed", auto_renewal: false }),
    requestId, now: "2026-08-30T00:01:00.000Z", stopProvider: async () => undefined,
  });

  assert.equal(result.outcome, "completed");
  assert.equal(db.updates.at(-1)?.auto_renewal, false);
});

test("partial provider success persists per subscription", async () => {
  const first = fakeSupabase();
  const second = fakeSupabase();
  const firstResult = await cancelOneSubscription({
    supabase: first.client as never, subscription: subscription({ id: "first" }), requestId,
    now: "2026-08-30T00:00:00.000Z", stopProvider: async () => undefined,
  });
  const secondResult = await cancelOneSubscription({
    supabase: second.client as never,
    subscription: subscription({ id: "second", order_id: "order-2" }), requestId,
    now: "2026-08-30T00:00:00.000Z", stopProvider: async () => { throw new Error("offline"); },
  });

  assert.equal(firstResult.outcome, "completed");
  assert.equal(secondResult.outcome, "provider_failed");
});

test("pending cancellation blocks renewal without claiming provider success", async () => {
  const db = fakeSupabase();
  let providerCalls = 0;
  const result = await cancelOneSubscription({
    supabase: db.client as never, subscription: subscription({ status: "pending" }), requestId,
    now: "2026-08-30T00:00:00.000Z", stopProvider: async () => { providerCalls += 1; },
  });

  assert.equal(result.outcome, "pending");
  assert.equal(providerCalls, 0);
  assert.equal(db.updates.at(-1)?.auto_renewal, false);
});

test("completed replay is idempotent", async () => {
  const db = fakeSupabase();
  let providerCalls = 0;
  const result = await cancelOneSubscription({
    supabase: db.client as never,
    subscription: subscription({ cancellation_state: "completed", auto_renewal: false, recurring_mode: "none" }),
    requestId, now: "2026-08-30T00:02:00.000Z",
    stopProvider: async () => { providerCalls += 1; },
  });

  assert.equal(result.outcome, "completed");
  assert.equal(providerCalls, 0);
  assert.equal(db.updates.length, 0);
});

test("legacy locally-disabled rows cannot claim completed without driver evidence", async () => {
  const db = fakeSupabase();
  let providerCalls = 0;
  const result = await cancelOneSubscription({
    supabase: db.client as never,
    subscription: subscription({ recurring_mode: "none", auto_renewal: false }),
    requestId, now: "2026-10-14T00:00:00.000Z",
    stopProvider: async () => { providerCalls += 1; },
  });
  assert.equal(result.outcome, "manual_review");
  assert.equal(providerCalls, 0);
  assert.equal(db.updates.some((update) => update.cancellation_state === "completed"), false);
});

test("manual lifetime access is never mutated by cancellation", async () => {
  const db = fakeSupabase();
  const result = await cancelOneSubscription({
    supabase: db.client as never,
    subscription: subscription({ plan: null, plan_type: "lifetime", payment_provider: "manual",
      recurring_mode: "none", auto_renewal: false }),
    requestId, now: "2026-10-14T00:00:00.000Z",
    stopProvider: async () => { assert.fail("must not stop lifetime"); },
  });
  assert.equal(result.outcome, "completed");
  assert.deepEqual(db.updates, []);
  assert.deepEqual(db.events, []);
});
