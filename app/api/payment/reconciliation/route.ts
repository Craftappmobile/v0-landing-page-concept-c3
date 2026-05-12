import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requirePaymentSupportToken } from "@/lib/payment-support-auth";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function parseLimit(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function parseBoolean(value: string | null): boolean {
  return value === "1" || value === "true" || value === "yes";
}

export async function GET(request: NextRequest) {
  try {
    const authError = requirePaymentSupportToken(request);
    if (authError) return authError;

    const url = new URL(request.url);
    const limit = parseLimit(url.searchParams.get("limit"));
    const includeNullEmailStatus = parseBoolean(url.searchParams.get("include_null_email_status"));
    const supabase = createAdminClient();

    const problemFilter = includeNullEmailStatus
      ? "user_id.is.null,email_status.is.null,email_status.in.(exception,failed,no_email_found)"
      : "user_id.is.null,email_status.in.(exception,failed,no_email_found)";

    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "id, order_id, hutko_payment_id, email, customer_name, plan, status, user_id, email_status, email_error, paid_amount, paid_currency, created_at, updated_at",
      )
      .eq("status", "active")
      .not("email", "is", null)
      .or(problemFilter)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      count: data?.length ?? 0,
      items: data ?? [],
    });
  } catch (error) {
    console.error("[Payment Reconciliation] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
