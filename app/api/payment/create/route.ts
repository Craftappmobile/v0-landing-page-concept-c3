import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";
const HUTKO_API_URL = "https://pay.hutko.org/api/checkout/url/";

/** Recurring plans — will send required_rectoken=Y to get token for server-side billing */
const RECURRING_PLANS = new Set(["quarter", "half", "year"]);

/** Plans configuration (amount in kopecks) */
const PLANS: Record<string, { amount: number; description: string }> = {
  quarter: { amount: 45496, description: "Підписка «Розрахуй і В'яжи» — 3 місяці" },
  half: { amount: 59999, description: "Підписка «Розрахуй і В'яжи» — 6 місяців" },
  year: { amount: 91800, description: "Підписка «Розрахуй і В'яжи» — 12 місяців" },
  forever: { amount: 458500, description: "Підписка «Розрахуй і В'яжи» — Довічна" },
};

/**
 * Generate Hutko signature (SHA1):
 * password + all params sorted alphabetically, joined with |
 */
function generateSignature(
  password: string,
  params: Record<string, string | number>
): string {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email, name } = body as {
      plan: string;
      email: string;
      name: string;
    };

    if (!plan || !email || !name) {
      return NextResponse.json(
        { error: "Заповніть всі поля" },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return NextResponse.json(
        { error: "Невідомий тарифний план" },
        { status: 400 }
      );
    }

    if (!MERCHANT_ID || !MERCHANT_PASSWORD) {
      return NextResponse.json(
        { error: "Платіжна система тимчасово недоступна. Спробуйте пізніше." },
        { status: 503 }
      );
    }

    const origin = request.headers.get("origin") || request.nextUrl.origin;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const isRecurring = RECURRING_PLANS.has(plan);

    const params: Record<string, string | number> = {
      order_id: orderId,
      merchant_id: Number(MERCHANT_ID),
      order_desc: planConfig.description,
      amount: planConfig.amount,
      currency: "UAH",
      version: "1.0.1",
      response_url: `${origin}/api/payment/redirect`,
      server_callback_url: `${origin}/api/payment/callback`,
      sender_email: email,
      lang: "uk",
      merchant_data: JSON.stringify({ plan, name, email }),
    };

    // For recurring plans, only request rectoken (we handle billing ourselves via cron)
    if (isRecurring) {
      params.required_rectoken = "Y";
    }

    params.signature = generateSignature(MERCHANT_PASSWORD, params);

    // Save pending subscription to DB before redirecting to Hutko
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const { error: dbError } = await supabase.from("subscriptions").insert({
      order_id: orderId,
      email,
      customer_name: name,
      plan,
      plan_type: plan,
      amount: planConfig.amount,
      currency: "UAH",
      status: "pending",
      payment_provider: "hutko",
      platform: "web",
      auto_renewal: isRecurring,
      started_at: now,
      expires_at: now, // will be updated by callback on successful payment
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    const res = await fetch(HUTKO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request: params }),
    });

    const data = await res.json();

    if (data?.response?.response_status === "success" && data.response.checkout_url) {
      return NextResponse.json({ checkout_url: data.response.checkout_url });
    }

    // If Hutko rejected — mark subscription as failed
    await supabase
      .from("subscriptions")
      .update({ status: "failed" })
      .eq("order_id", orderId);

    const errorMsg =
      data?.response?.error_message || "Помилка створення платежу. Спробуйте пізніше.";
    return NextResponse.json({ error: errorMsg }, { status: 502 });
  } catch {
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

