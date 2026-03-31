import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";
import { isPlanId, PLAN_CONFIG } from "@/lib/plans";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";
const HUTKO_RECURRING_URL = "https://pay.hutko.org/api/recurring";
const DEPRECATED_SITE_URL = "https://rozrahuy-i-vyazhi.vercel.app";

function getRecurringCallbackBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set for recurring payments");
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");

  if (normalizedSiteUrl === DEPRECATED_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL points to deprecated domain");
  }

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
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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

  // Find active recurring subscriptions expiring within next 24 hours
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: expiring, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .eq("auto_renewal", true)
    .not("rectoken", "is", null)
    .lte("expires_at", tomorrow.toISOString());

  if (error) {
    console.error("[Recurring] DB error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!expiring || expiring.length === 0) {
    return NextResponse.json({ message: "No subscriptions to renew", count: 0 });
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

    const newOrderId = `renew_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const params: Record<string, string | number> = {
      order_id: newOrderId,
      merchant_id: Number(MERCHANT_ID),
      order_desc: planConfig.recurringDescription || planConfig.paymentDescription,
      amount: planConfig.amount,
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
      });

      const data = await res.json();
      const status = data?.response?.order_status || data?.response?.response_status || "unknown";

      if (status === "approved") {
        // Extend subscription
        const newExpiry = new Date(sub.expires_at);
        newExpiry.setDate(newExpiry.getDate() + planConfig.days);

        await supabase
          .from("subscriptions")
          .update({
            order_id: newOrderId,
            expires_at: newExpiry.toISOString(),
            hutko_payment_id: data?.response?.payment_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sub.id);

        results.push({ order_id: newOrderId, status: "renewed" });
      } else {
        results.push({ order_id: newOrderId, status: `failed_${status}` });
      }
    } catch (err) {
      console.error("[Recurring] Charge error for", sub.order_id, err);
      results.push({ order_id: sub.order_id, status: "error" });
    }
  }

  console.log("[Recurring] Results:", results);
  return NextResponse.json({ message: "Recurring billing complete", results });
}

