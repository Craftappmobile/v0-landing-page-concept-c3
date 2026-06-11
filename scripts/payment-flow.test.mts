import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  buildCheckoutRedirectUrl,
  extractHutkoReservationCustomer,
  extractHutkoFailureDetails,
  extractCheckoutCorrelationIdFromValue,
  extractOrderIdFromValue,
  getInitialPaymentView,
  normalizeHutkoEmail,
  normalizeCheckoutStatus,
  normalizeSubscriptionStatus,
  parseHutkoMerchantData,
  resolveDirectPaymentAccessEmail,
  resolvePaymentAccessEmail,
  resolveDirectPaymentPlanId,
  resolveCheckoutFlow,
  resolvePaymentStatusView,
} from "../lib/payment-flow.ts"
import { buildHutkoButtonWidgetConfig, generateHutkoSignature } from "../lib/hutko.ts"

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

test("extractCheckoutCorrelationIdFromValue finds correlation ids in merchant_data payloads", () => {
  assert.equal(
    extractCheckoutCorrelationIdFromValue({ merchant_data: '{"checkout_correlation_id":"chk_123"}' }),
    "chk_123",
  )
  assert.equal(
    extractCheckoutCorrelationIdFromValue({ response: { correlation_id: "chk_456" } }),
    "chk_456",
  )
  assert.equal(extractCheckoutCorrelationIdFromValue("plain-string"), null)
})

test("parseHutkoMerchantData supports existing website object payloads", () => {
  assert.deepEqual(
    parseHutkoMerchantData('{"plan":"quarter","name":"Ольга","email":"Olga@Example.com","access_email":"Access@Example.com","order_id":"order_123","checkout_correlation_id":"chk_123"}'),
    {
      plan: "quarter",
      name: "Ольга",
      email: "olga@example.com",
      access_email: "access@example.com",
      order_id: "order_123",
      checkout_correlation_id: "chk_123",
    },
  )
})

test("parseHutkoMerchantData supports direct payment-link field arrays", () => {
  assert.deepEqual(
    parseHutkoMerchantData([
      { name: "access_email", label: "Email для доступу", value: "Access@Test.com" },
      { name: "sender_email", label: "Email", value: "Test@Example.com" },
      { name: "sender_name", label: "Ім'я", value: "Тест" },
      { name: "plan_code", label: "Код тарифу", value: "3" },
      { name: "order_id", label: "Order", value: "order_abc" },
    ]),
    {
      access_email: "access@test.com",
      email: "test@example.com",
      name: "Тест",
      plan_code: "3",
      order_id: "order_abc",
    },
  )
})

test("parseHutkoMerchantData supports direct payment-link callback fields", () => {
  assert.deepEqual(
    parseHutkoMerchantData({
      access_email: "access@example.com",
      sender_email: "TopLevel@Example.com",
      sender_name: "Покупець",
      plan_code: 3,
      order_id: "order_callback",
    }),
    {
      access_email: "access@example.com",
      email: "toplevel@example.com",
      name: "Покупець",
      plan_code: "3",
      order_id: "order_callback",
    },
  )
})

test("resolvePaymentAccessEmail prioritizes subscription email over access and payer emails", () => {
  assert.equal(
    resolvePaymentAccessEmail({
      subscriptionEmail: "Subscription@Example.com",
      accessEmail: "Access@Example.com",
      payerEmail: "Wallet@Example.com",
    }),
    "subscription@example.com",
  )

  assert.equal(
    resolvePaymentAccessEmail({
      accessEmail: "Access@Example.com",
      payerEmail: "Wallet@Example.com",
    }),
    "access@example.com",
  )

  assert.equal(resolvePaymentAccessEmail({ payerEmail: "Wallet@Example.com" }), "wallet@example.com")
})

test("resolveDirectPaymentAccessEmail never falls back to payer email", () => {
  assert.equal(
    resolveDirectPaymentAccessEmail({ accessEmail: "Access@Example.com" }),
    "access@example.com",
  )

  assert.equal(resolveDirectPaymentAccessEmail({}), "")
})

test("direct payment plan codes map to internal plans", () => {
  assert.equal(resolveDirectPaymentPlanId("3"), "quarter")
  assert.equal(resolveDirectPaymentPlanId(6), "half")
  assert.equal(resolveDirectPaymentPlanId("12"), "year")
  assert.equal(resolveDirectPaymentPlanId("9999"), "forever")
  assert.equal(resolveDirectPaymentPlanId("227480"), null)
})

test("Hutko customer helpers normalize email and reservation_data", () => {
  assert.equal(normalizeHutkoEmail("[Test@Example.com](mailto:Test@Example.com)"), "test@example.com")
  assert.deepEqual(
    extractHutkoReservationCustomer({ reservation_data: { sender_email: "Buyer@Example.com", sender_name: "Покупець" } }),
    { email: "buyer@example.com", name: "Покупець" },
  )
})

test("extractHutkoFailureDetails preserves non-sensitive Hutko failure metadata", () => {
  assert.deepEqual(
    extractHutkoFailureDetails({
      order_status: "declined",
      response_code: "271366907219563",
      error_code: "1024",
      error_description: "3DSecure authentication failed",
      additional_info: JSON.stringify({ response_status: "AUTHENTICATION_FAILED" }),
    }),
    {
      code: "1024",
      message: "3DSecure authentication failed",
      details: {
        error_code: "1024",
        error_description: "3DSecure authentication failed",
        order_status: "declined",
        response_code: "271366907219563",
        response_status: "AUTHENTICATION_FAILED",
      },
    },
  )
})

test("buildCheckoutRedirectUrl always redirects into processing state", () => {
  const withOrderId = buildCheckoutRedirectUrl("https://vjazhi.com.ua", {
    orderId: "order_abc",
    correlationId: "chk_123",
  })
  assert.equal(
    withOrderId.toString(),
    "https://vjazhi.com.ua/checkout?status=processing&order_id=order_abc&correlation_id=chk_123",
  )

  const withoutOrderId = buildCheckoutRedirectUrl("https://vjazhi.com.ua", { orderId: null, correlationId: null })
  assert.equal(withoutOrderId.toString(), "https://vjazhi.com.ua/checkout?status=processing")
})

test("checkout status normalization keeps backward compatibility for done", () => {
  assert.equal(normalizeCheckoutStatus("done"), "processing")
  assert.equal(normalizeCheckoutStatus("processing"), "processing")
  assert.equal(normalizeCheckoutStatus(null), null)
})

test("resolveCheckoutFlow uses Hutko button-link checkout for every plan", () => {
  assert.equal(resolveCheckoutFlow("quarter"), "button")
  assert.equal(resolveCheckoutFlow("half"), "button")
  assert.equal(resolveCheckoutFlow("year"), "button")
  assert.equal(resolveCheckoutFlow("forever"), "button")
})

test("buildHutkoButtonWidgetConfig supports payment-link params without forcing generic checkout fields", () => {
  const config = buildHutkoButtonWidgetConfig({
    buttonId: "button_token",
    orderId: "order_123",
    serverCallbackUrl: "https://example.com/api/payment/callback",
    senderEmail: "knit@example.com",
    merchantData: '{"checkout_correlation_id":"chk_123","order_id":"order_123"}',
    requiredRectoken: "Y",
  })

  assert.deepEqual(config.params, {
    button: "button_token",
    order_id: "order_123",
    server_callback_url: "https://example.com/api/payment/callback",
    sender_email: "knit@example.com",
    merchant_data: '{"checkout_correlation_id":"chk_123","order_id":"order_123"}',
    required_rectoken: "Y",
  })

  assert.equal("order_desc" in config.params, false)
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

test("generateHutkoSignature sorts non-empty params before hashing", () => {
  const signature = generateHutkoSignature("secret", {
    zeta: "last",
    alpha: "first",
    count: 42,
    empty: "",
  })

  assert.equal(signature, "47059808cd2b0da36d0f209b69e3e3dba0a921be")
})

test("payment access provisioning never uses direct auth.users SQL fallback", () => {
  const routeFiles = [
    "../app/api/payment/callback/route.ts",
    "../app/api/payment/retry-access/route.ts",
  ]

  for (const routeFile of routeFiles) {
    const source = readFileSync(new URL(routeFile, import.meta.url), "utf8")
    assert.equal(source.includes("create_paid_auth_user"), false, `${routeFile} must use Auth Admin API only`)
  }
})

test("failed Hutko callback stores failure details for support", () => {
  const source = readFileSync(new URL("../app/api/payment/callback/route.ts", import.meta.url), "utf8")

  assert.equal(source.includes("extractHutkoFailureDetails(body)"), true)
  assert.equal(source.includes("payment_failure_code"), true)
  assert.equal(source.includes("payment_failure_message"), true)
  assert.equal(source.includes("payment_failure_details"), true)
})