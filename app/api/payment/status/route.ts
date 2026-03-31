import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

type PaymentStatus = "pending" | "active" | "failed" | "not_found"

function normalizeSubscriptionStatus(status: string | null): PaymentStatus {
  if (status === "active") return "active"
  if (status === "failed" || status === "cancelled") return "failed"
  if (!status) return "not_found"
  return "pending"
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id")?.trim()

  if (!orderId) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("order_id", orderId)
      .maybeSingle()

    if (error) {
      console.error("[Payment Status] DB error:", error)
      return NextResponse.json({ error: "Failed to load payment status" }, { status: 500 })
    }

    return NextResponse.json(
      { status: normalizeSubscriptionStatus(data?.status ?? null) },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("[Payment Status] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}