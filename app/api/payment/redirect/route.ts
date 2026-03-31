import { NextRequest, NextResponse } from "next/server"
import { buildCheckoutRedirectUrl, extractOrderIdFromValue } from "@/lib/payment-flow"

async function extractOrderId(request: NextRequest) {
  const searchParamOrderId = request.nextUrl.searchParams.get("order_id")
  if (searchParamOrderId) {
    return searchParamOrderId.trim()
  }

  const contentType = request.headers.get("content-type") || ""

  try {
    if (contentType.includes("application/json")) {
      const body = await request.json()
      return extractOrderIdFromValue(body)
    }

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData()
      return extractOrderIdFromValue(formData.get("order_id"))
    }
  } catch (error) {
    console.warn("[Payment Redirect] Failed to extract order_id:", error)
  }

  return null
}

async function redirectToCheckout(request: NextRequest) {
  const orderId = await extractOrderId(request)
  const checkoutUrl = buildCheckoutRedirectUrl(request.nextUrl.origin, orderId)

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