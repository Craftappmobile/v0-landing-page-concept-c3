import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";
import { isPlanId, PLAN_CONFIG } from "@/lib/plans";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";
const HUTKO_API_URL = "https://pay.hutko.org/api/checkout/url/";

type PaymentFlow = "button" | "redirect";

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
    const { plan, email, name, flow } = body as {
      plan: string;
      email: string;
      name: string;
      flow?: PaymentFlow;
    };

    const paymentFlow: PaymentFlow = flow === "redirect" ? "redirect" : "button";
    const trimmedEmail = email?.trim();
    const trimmedName = name?.trim();

    if (!plan || !trimmedEmail || !trimmedName) {
      return NextResponse.json(
        { error: "Заповніть всі поля" },
        { status: 400 }
      );
    }

    if (!isPlanId(plan)) {
      return NextResponse.json(
        { error: "Невідомий тарифний план" },
        { status: 400 }
      );
    }

    const planConfig = PLAN_CONFIG[plan];

    if (!MERCHANT_ID || !MERCHANT_PASSWORD) {
      return NextResponse.json(
        { error: "Платіжна система тимчасово недоступна. Спробуйте пізніше." },
        { status: 503 }
      );
    }

    const origin = request.headers.get("origin") || request.nextUrl.origin;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const isRecurring = planConfig.isRecurring;
    const merchantData = JSON.stringify({
      plan,
      name: trimmedName,
      email: trimmedEmail,
    });

    const params: Record<string, string | number> = {
      order_id: orderId,
      merchant_id: Number(MERCHANT_ID),
      order_desc: planConfig.paymentDescription,
      amount: planConfig.amount,
      currency: "UAH",
      version: "1.0.1",
      response_url: `${origin}/api/payment/redirect`,
      server_callback_url: `${origin}/api/payment/callback`,
      sender_email: trimmedEmail,
      lang: "uk",
      merchant_data: merchantData,
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
      email: trimmedEmail,
      customer_name: trimmedName,
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
      console.error("[Payment Create] DB insert error:", dbError);
      return NextResponse.json(
        { error: "Не вдалося підготувати платіж. Спробуйте пізніше." },
        { status: 500 }
      );
    }

    if (paymentFlow === "button") {
      return NextResponse.json({
        order_id: orderId,
        hutko: {
          button_id: planConfig.hutkoButtonId,
          params: {
            order_id: orderId,
            merchant_data: merchantData,
            sender_email: trimmedEmail,
            email: trimmedEmail,
            response_url: `${origin}/api/payment/redirect`,
            server_callback_url: `${origin}/api/payment/callback`,
            lang: "uk",
            ...(isRecurring ? { required_rectoken: "Y" } : {}),
          },
        },
      });
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

