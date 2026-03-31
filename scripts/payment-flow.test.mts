import assert from "node:assert/strict"
import test from "node:test"

import {
  buildCheckoutRedirectUrl,
  extractOrderIdFromValue,
  getInitialPaymentView,
  normalizeCheckoutStatus,
  normalizeSubscriptionStatus,
  resolvePaymentStatusView,
} from "../lib/payment-flow.ts"

test("normalizeSubscriptionStatus maps subscription states for payment polling", () => {
  assert.equal(normalizeSubscriptionStatus({ status: "active" }), "active")
  assert.equal(normalizeSubscriptionStatus({ status: "failed" }), "failed")
  assert.equal(normalizeSubscriptionStatus({ status: null }), "not_found")
  assert.equal(normalizeSubscriptionStatus({ status: "pending" }), "pending")
})

test("normalizeSubscriptionStatus keeps access active for cancelled subscriptions until expiry", () => {
  assert.equal(
    normalizeSubscriptionStatus({ status: "cancelled", expiresAt: "2999-01-01T00:00:00.000Z" }),
    "active",
  )

  assert.equal(
    normalizeSubscriptionStatus({ status: "cancelled", expiresAt: "2020-01-01T00:00:00.000Z" }),
    "failed",
  )
})

test("extractOrderIdFromValue handles raw and nested Hutko payloads", () => {
  assert.equal(extractOrderIdFromValue("  order_123  "), "order_123")
  assert.equal(extractOrderIdFromValue({ order_id: "nested_1" }), "nested_1")
  assert.equal(extractOrderIdFromValue({ request: { order_id: "nested_2" } }), "nested_2")
  assert.equal(extractOrderIdFromValue({ response: { order_id: "nested_3" } }), "nested_3")
  assert.equal(extractOrderIdFromValue({ request: { response: { order_id: "nested_4" } } }), "nested_4")
  assert.equal(extractOrderIdFromValue("   "), null)
  assert.equal(extractOrderIdFromValue(null), null)
})

test("buildCheckoutRedirectUrl always redirects into processing state", () => {
  const withOrderId = buildCheckoutRedirectUrl("https://vjazhi.com.ua", "order_abc")
  assert.equal(withOrderId.toString(), "https://vjazhi.com.ua/checkout?status=processing&order_id=order_abc")

  const withoutOrderId = buildCheckoutRedirectUrl("https://vjazhi.com.ua", null)
  assert.equal(withoutOrderId.toString(), "https://vjazhi.com.ua/checkout?status=processing")
})

test("checkout status normalization keeps backward compatibility for done", () => {
  assert.equal(normalizeCheckoutStatus("done"), "processing")
  assert.equal(normalizeCheckoutStatus("processing"), "processing")
  assert.equal(normalizeCheckoutStatus(null), null)
})

test("initial payment view depends on whether order_id is available", () => {
  assert.deepEqual(getInitialPaymentView("order_123"), {
    state: "pending",
    message: "Ми очікуємо підтвердження платежу. Зазвичай це займає кілька секунд.",
  })

  assert.deepEqual(getInitialPaymentView(null), {
    state: "pending",
    message: "Ми обробляємо платіж. Якщо кошти вже списані, підтвердження надійде на вашу електронну пошту.",
  })
})

test("resolvePaymentStatusView returns terminal success and failure states", () => {
  assert.deepEqual(resolvePaymentStatusView({ status: "active", attempt: 0, maxAttempts: 12 }), {
    state: "success",
    message: "Оплату підтверджено. Підписка активується автоматично, а деталі ми надішлемо на email.",
  })

  assert.deepEqual(resolvePaymentStatusView({ status: "failed", attempt: 0, maxAttempts: 12 }), {
    state: "failure",
    message: "Оплату не вдалося підтвердити. Якщо кошти були списані, напишіть нам — ми перевіримо платіж вручну.",
  })
})

test("resolvePaymentStatusView keeps pending UX for retries, timeout, and fetch errors", () => {
  assert.deepEqual(resolvePaymentStatusView({ status: "pending", attempt: 0, maxAttempts: 12 }), {
    state: "pending",
    message: "Ми очікуємо підтвердження платежу. Зазвичай це займає кілька секунд.",
  })

  assert.deepEqual(resolvePaymentStatusView({ status: "not_found", attempt: 11, maxAttempts: 12 }), {
    state: "pending",
    message: "Платіж ще обробляється. Якщо підтвердження затримується, перевірте email трохи пізніше.",
  })

  assert.deepEqual(resolvePaymentStatusView({ status: "error", attempt: 3, maxAttempts: 12 }), {
    state: "pending",
    message: "Ми очікуємо підтвердження платежу. Якщо лист не надійде протягом кількох хвилин, напишіть нам.",
  })
})