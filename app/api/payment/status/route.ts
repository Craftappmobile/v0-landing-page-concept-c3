import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"
import { normalizeSubscriptionStatus } from "@/lib/payment-flow"

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id")?.trim()

  if (!orderId) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, expires_at")
      .eq("order_id", orderId)
      .maybeSingle()

    if (error) {
      console.error("[Payment Status] DB error:", error)
      return NextResponse.json({ error: "Failed to load payment status" }, { status: 500 })
    }

    return NextResponse.json(
      {
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