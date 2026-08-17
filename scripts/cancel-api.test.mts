import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  CANCELLABLE_SUBSCRIPTION_STATUSES,
  escapePostgrestLikePattern,
  getCancellationEmailPattern,
  getHutkoScheduleOrderIds,
  normalizeCancellationEmail,
} from "../lib/cancel-subscription.ts";
import { generateHutkoSignature, stopHutkoSubscription } from "../lib/hutko.ts";

test("/api/cancel normalizes submitted email before lookup", () => {
  assert.equal(normalizeCancellationEmail("  User.Name+Premium@Example.COM  "), "user.name+premium@example.com");
  assert.equal(normalizeCancellationEmail("   "), null);
  assert.equal(normalizeCancellationEmail(null), null);
});

test("/api/cancel escapes wildcard characters before case-insensitive email filter", () => {
  assert.equal(escapePostgrestLikePattern("user_name%test@example.com"), "user\\_name\\%test@example.com");
});

test("/api/cancel uses the escaped normalized email as the auto-renewal lookup pattern", () => {
  assert.equal(getCancellationEmailPattern("user_name%test@example.com"), "user\\_name\\%test@example.com");
});

test("/api/cancel supports legacy failed subscriptions that still have auto-renewal enabled", () => {
  assert.deepEqual(CANCELLABLE_SUBSCRIPTION_STATUSES, ["active", "failed"]);
});

test("getHutkoScheduleOrderIds selects Hutko schedules and skips merchant-token renewal", () => {
  assert.deepEqual(getHutkoScheduleOrderIds([
    {
      id: "schedule-1",
      order_id: " order-1 ",
      plan: "month",
      customer_name: "Customer",
      payment_provider: "hutko",
      recurring_mode: "hutko_schedule",
    },
    {
      id: "token-1",
      order_id: "order-2",
      plan: "month",
      customer_name: "Customer",
      payment_provider: "hutko",
      recurring_mode: "merchant_token",
    },
  ]), ["order-1"]);
});

test("getHutkoScheduleOrderIds rejects an unsafe subscription instead of confirming cancellation", () => {
  assert.throws(() => getHutkoScheduleOrderIds([{
    id: "unsafe-1",
    order_id: null,
    plan: "month",
    customer_name: "Customer",
    payment_provider: "hutko",
    recurring_mode: "hutko_schedule",
  }]), /Missing Hutko order_id/);
});

test("getHutkoScheduleOrderIds rejects an unclassified legacy recurring mode", () => {
  assert.throws(() => getHutkoScheduleOrderIds([{
    id: "legacy-1",
    order_id: "legacy-order",
    plan: "month",
    customer_name: "Customer",
    payment_provider: "hutko",
    recurring_mode: "unknown",
  }]), /Unknown recurring mode/);
});

test("stopHutkoSubscription signs and sends Hutko action=stop", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init || {} });
    return new Response(JSON.stringify({
      response: { response_status: "success", status: "Subscription stopped successfully" },
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const result = await stopHutkoSubscription({
    orderId: "order-123",
    merchantId: "1700002",
    password: "test-key",
    fetchImpl: fetchImpl as typeof fetch,
  });

  assert.equal(result.status, "Subscription stopped successfully");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://pay.hutko.org/api/subscription/");
  const body = JSON.parse(String(calls[0].init.body));
  assert.deepEqual(body.request, {
    merchant_id: 1700002,
    order_id: "order-123",
    action: "stop",
    signature: generateHutkoSignature("test-key", {
      merchant_id: 1700002,
      order_id: "order-123",
      action: "stop",
    }),
  });
});

test("stopHutkoSubscription rejects a Hutko failure response", async () => {
  const fetchImpl = async () => new Response(JSON.stringify({
    response: { response_status: "failure", error_code: 2032 },
  }), { status: 200, headers: { "Content-Type": "application/json" } });

  await assert.rejects(stopHutkoSubscription({
    orderId: "order-123",
    merchantId: "1700002",
    password: "test-key",
    fetchImpl: fetchImpl as typeof fetch,
  }), /Hutko subscription stop failed/);
});

test("/api/cancel stops Hutko before updating local subscription state", () => {
  const source = readFileSync(new URL("../app/api/cancel/route.ts", import.meta.url), "utf8");
  const hutkoStopIndex = source.indexOf("await Promise.all(hutkoOrderIds.map");
  const databaseUpdateIndex = source.indexOf('.from("subscriptions")\n      .update');

  assert.notEqual(hutkoStopIndex, -1);
  assert.notEqual(databaseUpdateIndex, -1);
  assert.equal(hutkoStopIndex < databaseUpdateIndex, true);
  assert.equal(source.includes('.in("id", subscriptionIds)\n      .eq("auto_renewal", true)'), false);
});