export type PaymentStatus = "pending" | "active" | "failed" | "not_found"
export type PaymentState = "pending" | "success" | "failure"
export type CheckoutFlow = "button" | "redirect"

export type PaymentViewModel = {
  state: PaymentState
  message: string
}

type CheckoutRedirectIdentifiers = {
  orderId?: string | null
  correlationId?: string | null
}

type SubscriptionStatusInput = {
  status: string | null
  expiresAt?: string | null
}

const PROCESSING_MESSAGE = "Ми очікуємо підтвердження платежу. Зазвичай це займає кілька секунд."
const DELAYED_PROCESSING_MESSAGE = "Платіж ще обробляється. Якщо підтвердження затримується, перевірте email трохи пізніше."
const MISSING_ORDER_ID_MESSAGE = "Ми обробляємо платіж. Якщо кошти вже списані, підтвердження надійде на вашу електронну пошту."
const PAYMENT_SUCCESS_MESSAGE = "Оплату підтверджено. Підписка активується автоматично, а деталі ми надішлемо на email."
const PAYMENT_FAILURE_MESSAGE = "Оплату не вдалося підтвердити. Якщо кошти були списані, напишіть нам — ми перевіримо платіж вручну."
const PAYMENT_ERROR_MESSAGE = "Ми очікуємо підтвердження платежу. Якщо лист не надійде протягом кількох хвилин, напишіть нам."

export function resolveCheckoutFlow(planId: string): CheckoutFlow {
  void planId
  return "button"
}

export function normalizeSubscriptionStatus({ status, expiresAt }: SubscriptionStatusInput): PaymentStatus {
  if (status === "active") return "active"

  if (status === "cancelled") {
    const expiryTime = expiresAt ? Date.parse(expiresAt) : Number.NaN
    if (!Number.isNaN(expiryTime) && expiryTime > Date.now()) {
      return "active"
    }
    return "failed"
  }

  if (status === "failed") return "failed"
  if (!status) return "not_found"
  return "pending"
}

export function extractOrderIdFromValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return null

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return extractOrderIdFromValue(JSON.parse(trimmed))
      } catch {
        // Ignore parse failures and treat the value as a raw order id.
      }
    }

    return trimmed
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    return (
      extractOrderIdFromValue(record.order_id) ??
      extractOrderIdFromValue(record.request) ??
      extractOrderIdFromValue(record.response)
    )
  }

  return null
}

export function extractCheckoutCorrelationIdFromValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return null

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return extractCheckoutCorrelationIdFromValue(JSON.parse(trimmed))
      } catch {
        return null
      }
    }

    return null
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>

    if (typeof record.checkout_correlation_id === "string" && record.checkout_correlation_id.trim()) {
      return record.checkout_correlation_id.trim()
    }

    if (typeof record.correlation_id === "string" && record.correlation_id.trim()) {
      return record.correlation_id.trim()
    }

    return (
      extractCheckoutCorrelationIdFromValue(record.merchant_data) ??
      extractCheckoutCorrelationIdFromValue(record.request) ??
      extractCheckoutCorrelationIdFromValue(record.response)
    )
  }

  return null
}

export function buildCheckoutRedirectUrl(origin: string, identifiers: CheckoutRedirectIdentifiers) {
  const checkoutUrl = new URL("/checkout", origin)
  checkoutUrl.searchParams.set("status", "processing")

  if (identifiers.orderId) {
    checkoutUrl.searchParams.set("order_id", identifiers.orderId)
  }

  if (identifiers.correlationId) {
    checkoutUrl.searchParams.set("correlation_id", identifiers.correlationId)
  }

  return checkoutUrl
}

export function normalizeCheckoutStatus(rawStatus: string | null) {
  return rawStatus === "done" ? "processing" : rawStatus
}

export function getInitialPaymentView(orderId: string | null): PaymentViewModel {
  return {
    state: "pending",
    message: orderId ? PROCESSING_MESSAGE : MISSING_ORDER_ID_MESSAGE,
  }
}

export function resolvePaymentStatusView(args: {
  status: PaymentStatus | "error"
  attempt: number
  maxAttempts: number
}): PaymentViewModel {
  if (args.status === "active") {
    return { state: "success", message: PAYMENT_SUCCESS_MESSAGE }
  }

  if (args.status === "failed") {
    return { state: "failure", message: PAYMENT_FAILURE_MESSAGE }
  }

  if (args.status === "error") {
    return { state: "pending", message: PAYMENT_ERROR_MESSAGE }
  }

  return {
    state: "pending",
    message: args.attempt >= args.maxAttempts - 1 ? DELAYED_PROCESSING_MESSAGE : PROCESSING_MESSAGE,
  }
}