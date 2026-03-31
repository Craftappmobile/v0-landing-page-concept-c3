import { NextRequest, NextResponse } from "next/server"

function extractOrderIdFromValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed || null
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
      const orderId = formData.get("order_id")
      return typeof orderId === "string" ? orderId.trim() || null : null
    }
  } catch (error) {
    console.warn("[Payment Redirect] Failed to extract order_id:", error)
  }

  return null
}

async function redirectToCheckout(request: NextRequest) {
  const orderId = await extractOrderId(request)
  const checkoutUrl = new URL("/checkout", request.nextUrl.origin)

  checkoutUrl.searchParams.set("status", "processing")
  if (orderId) {
    checkoutUrl.searchParams.set("order_id", orderId)
  }

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

