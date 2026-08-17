import crypto from "crypto"

export type HutkoRequestParams = Record<string, string | number>

type HutkoSubscriptionAction = "start" | "stop"

type HutkoSubscriptionActionResponse = {
  response?: {
    response_status?: string
    status?: string
    error_code?: string | number
  }
}

const HUTKO_SUBSCRIPTION_URL = "https://pay.hutko.org/api/subscription/"

export type HutkoButtonCheckoutParams = {
  button: string
  order_id?: string
  order_desc?: string
  merchant_data?: string
  sender_email?: string
  server_callback_url?: string
  response_url?: string
  lang?: string
  required_rectoken?: "Y"
}

export type HutkoButtonCheckoutOptions = {
  email: boolean
  theme: {
    type: "light" | "dark"
  }
  methods: string[]
  endpoint: {
    button: string
    gateway: string
  }
  apiDomain: string
  card_icons: string[]
  fullScreen: boolean
  methods_disabled: string[]
  hide_button_title: boolean
}

export type HutkoButtonWidgetConfig = {
  params: HutkoButtonCheckoutParams
  options: HutkoButtonCheckoutOptions
}

export function generateHutkoSignature(password: string, params: HutkoRequestParams): string {
  const filtered: HutkoRequestParams = {}

  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value !== null && value !== undefined) {
      filtered[key] = value
    }
  }

  const sortedKeys = Object.keys(filtered).sort()
  const values = sortedKeys.map((key) => String(filtered[key]))
  const signString = [password, ...values].join("|")

  return crypto.createHash("sha1").update(signString, "utf8").digest("hex")
}

export async function stopHutkoSubscription(args: {
  orderId: string
  merchantId: string
  password: string
  fetchImpl?: typeof fetch
}): Promise<{ status: string }> {
  const orderId = args.orderId.trim()
  const merchantId = Number(args.merchantId)

  if (!orderId) throw new Error("Hutko subscription order_id is required")
  if (!Number.isSafeInteger(merchantId) || merchantId <= 0) {
    throw new Error("HUTKO_MERCHANT_ID is invalid")
  }
  if (!args.password) throw new Error("HUTKO_MERCHANT_PASSWORD is not set")

  const action: HutkoSubscriptionAction = "stop"
  const params: HutkoRequestParams = {
    merchant_id: merchantId,
    order_id: orderId,
    action,
  }
  const request = {
    ...params,
    signature: generateHutkoSignature(args.password, params),
  }
  const fetchImpl = args.fetchImpl ?? fetch
  const response = await fetchImpl(HUTKO_SUBSCRIPTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request }),
    signal: AbortSignal.timeout(15_000),
  })

  let payload: HutkoSubscriptionActionResponse | null = null
  try {
    payload = await response.json() as HutkoSubscriptionActionResponse
  } catch {
    throw new Error(`Hutko subscription API returned invalid JSON (${response.status})`)
  }

  if (!response.ok || payload.response?.response_status !== "success") {
    const errorCode = payload.response?.error_code
    throw new Error(
      `Hutko subscription stop failed (${response.status}${errorCode ? `, code ${errorCode}` : ""})`,
    )
  }

  return { status: payload.response.status || "success" }
}

export function buildHutkoButtonWidgetConfig(args: {
  buttonId: string
  orderId?: string
  orderDesc?: string
  serverCallbackUrl?: string
  responseUrl?: string
  senderEmail?: string
  lang?: string
  merchantData?: string
  requiredRectoken?: "Y"
}): HutkoButtonWidgetConfig {
  const params: HutkoButtonCheckoutParams = {
    button: args.buttonId,
  }

  if (args.orderId) {
    params.order_id = args.orderId
  }

  if (args.orderDesc) {
    params.order_desc = args.orderDesc
  }

  if (args.serverCallbackUrl) {
    params.server_callback_url = args.serverCallbackUrl
  }

  if (args.responseUrl) {
    params.response_url = args.responseUrl
  }

  if (args.senderEmail) {
    params.sender_email = args.senderEmail
  }

  if (args.lang) {
    params.lang = args.lang
  }

  if (args.merchantData) {
    params.merchant_data = args.merchantData
  }

  if (args.requiredRectoken) {
    params.required_rectoken = args.requiredRectoken
  }

  return {
    params,
    options: {
      email: false,
      theme: {
        type: "light",
      },
      methods: ["card"],
      endpoint: {
        button: "/latest/checkout-v2/button/index.html",
        gateway: "/latest/checkout-v2/index.html",
      },
      apiDomain: "pay.hutko.org",
      card_icons: ["mastercard", "visa", "maestro"],
      fullScreen: false,
      methods_disabled: [],
      hide_button_title: true,
    },
  }
}