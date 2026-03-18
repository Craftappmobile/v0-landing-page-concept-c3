import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";

const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

/** Duration in days for each plan */
const PLAN_DURATION: Record<string, number> = {
  quarter: 90,
  half: 180,
  year: 365,
  forever: 36500, // ~100 years
};

/**
 * Verify Hutko callback signature (SHA1).
 * password + sorted param values joined with |
 */
function verifySignature(
  password: string,
  params: Record<string, string | number>,
  receivedSignature: string
): boolean {
  const filtered: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (
      key !== "signature" &&
      key !== "response_signature_string" &&
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      filtered[key] = value;
    }
  }
  const sortedKeys = Object.keys(filtered).sort();
  const values = sortedKeys.map((k) => String(filtered[k]));
  const signString = [password, ...values].join("|");
  const expected = crypto.createHash("sha1").update(signString, "utf8").digest("hex");
  return expected === receivedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Hutko sends callback data in body directly
    const {
      order_id,
      order_status,
      signature,
      rectoken,
      payment_id,
      merchant_data,
      ...restParams
    } = body as Record<string, string>;

    if (!order_id || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build params for signature verification (exclude signature itself)
    const paramsForSign: Record<string, string | number> = { order_id, order_status };
    // Include all other params that Hutko sent (except signature)
    for (const [key, value] of Object.entries(restParams)) {
      if (key !== "signature" && key !== "response_signature_string" && value) {
        paramsForSign[key] = value;
      }
    }
    if (rectoken) paramsForSign.rectoken = rectoken;
    if (payment_id) paramsForSign.payment_id = payment_id;
    if (merchant_data) paramsForSign.merchant_data = merchant_data;

    // Verify signature
    if (!verifySignature(MERCHANT_PASSWORD, paramsForSign, signature)) {
      console.error("[Hutko Callback] Invalid signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = createAdminClient();

    if (order_status === "approved") {
      // Parse merchant_data for plan info
      let plan = "";
      try {
        const parsed = JSON.parse(merchant_data || "{}");
        plan = parsed.plan || "";
      } catch {
        // merchant_data might not be JSON
      }

      const durationDays = PLAN_DURATION[plan] || 90;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

      // Update subscription to active
      const updateData: Record<string, string | boolean | null> = {
        status: "active",
        hutko_payment_id: payment_id || null,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      };

      // Save rectoken for future recurring charges
      if (rectoken) {
        updateData.rectoken = rectoken;
      }

      await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("order_id", order_id);

      console.log("[Hutko Callback] Subscription activated:", order_id);
    } else {
      // Payment failed or declined
      await supabase
        .from("subscriptions")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("order_id", order_id);

      console.log("[Hutko Callback] Payment failed:", order_id, order_status);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Hutko Callback] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

