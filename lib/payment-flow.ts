export type PaymentStatus = "pending" | "active" | "failed" | "not_found"
export type PaymentState = "pending" | "success" | "failure"
export type CheckoutFlow = "button" | "redirect"

export type PaymentViewModel = {
  state: PaymentState
  message: string
}

export type DirectPaymentPlanId = "quarter" | "half" | "year" | "forever"

export type HutkoFailureDetails = {
  code: string | null
  message: string | null
  details: Record<string, string>
}

export type HutkoMerchantData = {
  plan?: string
  plan_code?: string
  name?: string
  email?: string
  access_email?: string
  order_id?: string
  checkout_correlation_id?: string
  renewal?: boolean
  parent_order?: string
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

const DIRECT_PAYMENT_PLAN_CODE_TO_PLAN_ID: Record<string, DirectPaymentPlanId> = {
  "3": "quarter",
  "6": "half",
  "12": "year",
  "9999": "forever",
}

const HUTKO_FAILURE_DETAIL_KEYS = new Set([
  "api_error_code",
  "api_error_description",
  "api_error_id",
  "api_error_identifier",
  "decline_code",
  "decline_reason",
  "error_code",
  "error_description",
  "error_message",
  "failure_code",
  "failure_reason",
  "order_status",
  "payment_error_code",
  "payment_error_description",
  "response_code",
  "response_description",
  "response_status",
  "status_description",
])

const HUTKO_FAILURE_CODE_KEYS = [
  "api_error_code",
  "error_code",
  "payment_error_code",
  "failure_code",
  "decline_code",
  "response_code",
  "api_error_id",
  "api_error_identifier",
  "response_status",
  "order_status",
]

const HUTKO_FAILURE_MESSAGE_KEYS = [
  "api_error_description",
  "error_description",
  "payment_error_description",
  "failure_reason",
  "decline_reason",
  "response_description",
  "status_description",
  "error_message",
  "order_status",
]

function stringValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed || null
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return null
}

function normalizePayloadKey(key: string) {
  return key.trim().replace(/[\s-]+/g, "_").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()
}

function collectHutkoFailureDetails(value: unknown, target: Record<string, string>, depth = 0) {
  if (!value || depth > 3) return

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || !(trimmed.startsWith("{") || trimmed.startsWith("["))) return
    try {
      collectHutkoFailureDetails(JSON.parse(trimmed), target, depth + 1)
    } catch {
      // Ignore non-JSON callback strings.
    }
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) collectHutkoFailureDetails(item, target, depth + 1)
    return
  }

  if (typeof value !== "object") return

  for (const [rawKey, rawValue] of Object.entries(value as Record<string, unknown>)) {
    const key = normalizePayloadKey(rawKey)
    const normalizedValue = stringValue(rawValue)

    if (HUTKO_FAILURE_DETAIL_KEYS.has(key) && normalizedValue) {
      target[key] = normalizedValue
    }

    if (rawValue && typeof rawValue === "object") {
      collectHutkoFailureDetails(rawValue, target, depth + 1)
    } else if (typeof rawValue === "string" && rawValue.trim().startsWith("{")) {
      collectHutkoFailureDetails(rawValue, target, depth + 1)
    }
  }
}

export function extractHutkoFailureDetails(payload: unknown): HutkoFailureDetails {
  const details: Record<string, string> = {}
  collectHutkoFailureDetails(payload, details)

  return {
    code: HUTKO_FAILURE_CODE_KEYS.map((key) => details[key]).find(Boolean) ?? null,
    message: HUTKO_FAILURE_MESSAGE_KEYS.map((key) => details[key]).find(Boolean) ?? null,
    details,
  }
}

export function normalizeHutkoEmail(value: unknown): string | null {
  const rawValue = stringValue(value)
  if (!rawValue) return null

  const mailtoMatch = rawValue.match(/mailto:([^\s)]+)/i)
  const emailLike = mailtoMatch?.[1] ?? rawValue
  const bracketMatch = emailLike.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)

  return (bracketMatch?.[0] ?? emailLike).trim().toLowerCase() || null
}

export function resolvePaymentAccessEmail(args: {
  subscriptionEmail?: unknown
  accessEmail?: unknown
  payerEmail?: unknown
}) {
  return (
    normalizeHutkoEmail(args.subscriptionEmail) ??
    normalizeHutkoEmail(args.accessEmail) ??
    normalizeHutkoEmail(args.payerEmail) ??
    ""
  )
}

export function resolveDirectPaymentAccessEmail(args: {
  accessEmail?: unknown
}) {
  return normalizeHutkoEmail(args.accessEmail) ?? ""
}

export function resolveDirectPaymentPlanId(planCode: unknown): DirectPaymentPlanId | null {
  const normalizedPlanCode = stringValue(planCode)
  return normalizedPlanCode ? DIRECT_PAYMENT_PLAN_CODE_TO_PLAN_ID[normalizedPlanCode] ?? null : null
}

function assignMerchantField(target: HutkoMerchantData, fieldName: unknown, fieldValue: unknown) {
  const name = stringValue(fieldName)
  const value = stringValue(fieldValue)
  if (!name || !value) return

  if (name === "access_email" || name === "app_email") {
    target.access_email = normalizeHutkoEmail(value) ?? value
    return
  }

  if (name === "sender_email" || name === "customer_email" || name === "email") {
    target.email = normalizeHutkoEmail(value) ?? value
    return
  }

  if (name === "sender_name" || name === "customer_name" || name === "name") {
    target.name = value
    return
  }

  if (
    name === "plan_code" ||
    name === "plan" ||
    name === "checkout_correlation_id" ||
    name === "parent_order" ||
    name === "order_id"
  ) {
    target[name] = value
  }
}

export function parseHutkoMerchantData(rawValue: unknown): HutkoMerchantData {
  if (!rawValue) return {}

  if (typeof rawValue === "string") {
    const trimmed = rawValue.trim()
    if (!trimmed) return {}

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return parseHutkoMerchantData(JSON.parse(trimmed))
      } catch {
        return {}
      }
    }

    return {}
  }

  if (Array.isArray(rawValue)) {
    const parsed: HutkoMerchantData = {}
    for (const item of rawValue) {
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>
        assignMerchantField(parsed, record.name, record.value)
      }
    }
    return parsed
  }

  if (typeof rawValue === "object") {
    const record = rawValue as Record<string, unknown>
    const parsed: HutkoMerchantData = {}

    const plan = stringValue(record.plan)
    const planCode = stringValue(record.plan_code)
    const name = stringValue(record.name) ?? stringValue(record.sender_name) ?? stringValue(record.customer_name)
    const accessEmail = normalizeHutkoEmail(record.access_email) ?? normalizeHutkoEmail(record.app_email)
    const email = normalizeHutkoEmail(record.email) ?? normalizeHutkoEmail(record.sender_email) ?? normalizeHutkoEmail(record.customer_email)
    const orderId = stringValue(record.order_id)
    const checkoutCorrelationId = stringValue(record.checkout_correlation_id)
    const parentOrder = stringValue(record.parent_order)

    if (plan) parsed.plan = plan
    if (planCode) parsed.plan_code = planCode
    if (name) parsed.name = name
    if (accessEmail) parsed.access_email = accessEmail
    if (email) parsed.email = email
    if (orderId) parsed.order_id = orderId
    if (checkoutCorrelationId) parsed.checkout_correlation_id = checkoutCorrelationId
    if (record.renewal === true) parsed.renewal = true
    if (parentOrder) parsed.parent_order = parentOrder

    return parsed
  }

  return {}
}

export function extractHutkoReservationCustomer(additionalInfo: unknown): Pick<HutkoMerchantData, "email" | "name"> {
  if (!additionalInfo || typeof additionalInfo !== "object") return {}

  const record = additionalInfo as Record<string, unknown>
  const reservationData = record.reservation_data
  if (!reservationData || typeof reservationData !== "object") return {}

  const reservationRecord = reservationData as Record<string, unknown>
  const email = normalizeHutkoEmail(reservationRecord.sender_email)
  const name = stringValue(reservationRecord.sender_name)

  return {
    ...(email ? { email } : {}),
    ...(name ? { name } : {}),
  }
}

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