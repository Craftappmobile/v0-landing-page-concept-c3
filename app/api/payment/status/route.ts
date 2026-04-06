import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { normalizeSubscriptionStatus } from "@/lib/payment-flow"

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id")?.trim()
  const correlationId = request.nextUrl.searchParams.get("correlation_id")?.trim()

  if (!orderId && !correlationId) {
    return NextResponse.json({ error: "order_id or correlation_id is required" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const fetchByOrderId = async () => supabase
      .from("subscriptions")
      .select("order_id, status, expires_at")
      .eq("order_id", orderId)
      .maybeSingle()

    const fetchByCorrelationId = async () => supabase
      .from("subscriptions")
      .select("order_id, status, expires_at")
      .eq("checkout_correlation_id", correlationId)
      .maybeSingle()

    let data = null
    let error = null

    if (orderId) {
      const result = await fetchByOrderId()
      data = result.data
      error = result.error
    }

    if (!data && !error && correlationId) {
      const result = await fetchByCorrelationId()
      data = result.data
      error = result.error
    }

    if (error) {
      console.error("[Payment Status] DB error:", error)
      return NextResponse.json({ error: "Failed to load payment status" }, { status: 500 })
    }

    return NextResponse.json(
      {
        order_id: data?.order_id ?? null,
        status: normalizeSubscriptionStatus({
          status: data?.status ?? null,
          expiresAt: data?.expires_at ?? null,
        }),
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("[Payment Status] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}