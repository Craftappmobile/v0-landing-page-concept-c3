import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";
import { getPlanRenewalAmount, isPlanId, PLAN_CONFIG } from "@/lib/plans";
import { RECURRING_MODE } from "@/lib/recurring-mode";
import { stopHutkoSubscription } from "@/lib/hutko";
import { runSubscriptionCancellationJobs } from "@/lib/unlimited-subscriptions";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";
const HUTKO_RECURRING_URL = "https://pay.hutko.org/api/recurring";

function getRecurringCallbackBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set for recurring payments");
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");

  return normalizedSiteUrl;
}

function generateSignature(password: string, params: Record<string, string | number>): string {
  const filtered: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value !== null && value !== undefined) {
      filtered[key] = value;
    }
  }
  const sortedKeys = Object.keys(filtered).sort();
  const values = sortedKeys.map((k) => String(filtered[k]));
  const signString = [password, ...values].join("|");
  return crypto.createHash("sha1").update(signString, "utf8").digest("hex");
}

/**
 * Cron job: find active subscriptions expiring within 1 day and charge them.
 * Protected by CRON_SECRET header (Vercel Cron).
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Recurring job is not configured" }, { status: 503 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let callbackBaseUrl = "";

  try {
    callbackBaseUrl = getRecurringCallbackBaseUrl();
  } catch (error) {
    console.error("[Recurring] Invalid NEXT_PUBLIC_SITE_URL:", error);
    return NextResponse.json({ error: "Recurring payments are misconfigured" }, { status: 500 });
  }

  const supabase = createAdminClient();
  let cancellations;
  try {
    cancellations = await runSubscriptionCancellationJobs({
      supabase, now: new Date(),
      stopProvider: (orderId) => stopHutkoSubscription({ orderId, merchantId: MERCHANT_ID, password: MERCHANT_PASSWORD }),
    });
  } catch {
    return NextResponse.json({ error: "Cancellation queue unavailable; billing paused" }, { status: 503 });
  }

  // Only merchant-managed token subscriptions may be charged here.
  // Hutko-scheduled and unclassified subscriptions must never be duplicated by this cron.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: expiring, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .eq("auto_renewal", true)
    .eq("cancellation_state", "none")
    .eq("recurring_mode", RECURRING_MODE.MERCHANT_TOKEN)
    .not("rectoken", "is", null)
    .lte("expires_at", tomorrow.toISOString());

  if (error) {
    console.error("[Recurring] DB error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!expiring || expiring.length === 0) {
    return NextResponse.json({ message: "No subscriptions to renew", count: 0, cancellations });
  }

  const results: Array<{ order_id: string; status: string }> = [];

  for (const sub of expiring) {
    const planId = typeof sub.plan === "string" ? sub.plan : "";

    if (!isPlanId(planId)) {
      results.push({ order_id: sub.order_id, status: "skipped_unknown_plan" });
      continue;
    }

    const planConfig = PLAN_CONFIG[planId];
    if (!planConfig.isRecurring) {
      results.push({ order_id: sub.order_id, status: "skipped_non_recurring_plan" });
      continue;
    }

    const chargeClaim = await supabase.rpc("claim_hutko_recurring_charge", { p_subscription_id: sub.id });
    if (chargeClaim.error) {
      return NextResponse.json({ error: "Billing claim unavailable; billing paused" }, { status: 503 });
    }
    const newOrderId = chargeClaim.data;
    if (typeof newOrderId !== "string" || !newOrderId) {
      results.push({ order_id: sub.order_id, status: "skipped_unlimited_cancelled_or_claimed" });
      continue;
    }

    const params: Record<string, string | number> = {
      order_id: newOrderId,
      merchant_id: Number(MERCHANT_ID),
      order_desc: planConfig.recurringDescription || planConfig.paymentDescription,
      amount: getPlanRenewalAmount(planId),
      currency: "UAH",
      version: "1.0.1",
      rectoken: sub.rectoken,
      server_callback_url: `${callbackBaseUrl}/api/payment/callback`,
      merchant_data: JSON.stringify({ plan: planId, name: sub.customer_name, email: sub.email, renewal: true, parent_order: sub.order_id }),
    };

    params.signature = generateSignature(MERCHANT_PASSWORD, params);

    try {
      const res = await fetch(HUTKO_RECURRING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: params }),
        signal: AbortSignal.timeout(15_000),
      });

      const data = await res.json();
      const orderStatus = data?.response?.order_status || null;
      const responseStatus = data?.response?.response_status || "unknown";

      if (orderStatus === "approved" || responseStatus === "success") {
        // Hutko callback is the single source of truth for DB updates.
        results.push({ order_id: newOrderId, status: "approved_waiting_callback" });
      } else {
        results.push({ order_id: newOrderId, status: `failed_${orderStatus || responseStatus}` });
      }
    } catch {
      // Keep the claim: an ambiguous network failure must not cause a second charge.
      results.push({ order_id: newOrderId, status: "needs_provider_reconciliation" });
    }
  }

  console.log("[Recurring] Results:", results);
  return NextResponse.json({ message: "Recurring billing complete", results, cancellations });
}

