import { NextRequest, NextResponse } from "next/server"
import {
  buildCheckoutRedirectUrl,
  extractCheckoutCorrelationIdFromValue,
  extractOrderIdFromValue,
} from "@/lib/payment-flow"

async function extractIdentifiers(request: NextRequest) {
  const searchParamOrderId = request.nextUrl.searchParams.get("order_id")
  const searchParamCorrelationId = request.nextUrl.searchParams.get("correlation_id")
  const searchParamMerchantData = request.nextUrl.searchParams.get("merchant_data")

  let orderId = searchParamOrderId?.trim() || null
  let correlationId = searchParamCorrelationId?.trim() || null

  if (!correlationId && searchParamMerchantData) {
    correlationId = extractCheckoutCorrelationIdFromValue(searchParamMerchantData)
  }

  if (orderId || correlationId) {
    return { orderId, correlationId }
  }

  const contentType = request.headers.get("content-type") || ""

  try {
    if (contentType.includes("application/json")) {
      const body = await request.json()
      orderId = extractOrderIdFromValue(body)
      correlationId = extractCheckoutCorrelationIdFromValue(body)
      return { orderId, correlationId }
    }

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData()
      orderId = extractOrderIdFromValue(formData.get("order_id"))
      correlationId =
        extractCheckoutCorrelationIdFromValue(formData.get("correlation_id")) ??
        extractCheckoutCorrelationIdFromValue(formData.get("merchant_data"))
      return { orderId, correlationId }
    }
  } catch (error) {
    console.warn("[Payment Redirect] Failed to extract identifiers:", error)
  }

  return { orderId: null, correlationId: null }
}

async function redirectToCheckout(request: NextRequest) {
  const identifiers = await extractIdentifiers(request)
  const checkoutUrl = buildCheckoutRedirectUrl(request.nextUrl.origin, identifiers)

  return NextResponse.redirect(checkoutUrl, {
    status: 303,
  })
}

/**
 * Hutko redirects the user back via POST after payment.
 * This handler accepts the POST and redirects the user to the checkout success page via GET.
 */
export async function POST(request: NextRequest) {
  return redirectToCheckout(request)
}

/** Also handle GET in case Hutko or user navigates directly */
export async function GET(request: NextRequest) {
  return redirectToCheckout(request)
}