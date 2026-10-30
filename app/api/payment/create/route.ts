import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createHutkoCheckoutUrl } from "@/lib/hutko";
import { getEmailValidationError, sanitizeEmailInput } from "@/lib/email-validation";
import { isPlanId, isPlanPurchasable, PLAN_CONFIG } from "@/lib/plans";
import { resolveApiCheckoutRecurringMode } from "@/lib/recurring-mode";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email, name } = body as {
      plan: string;
      email: string;
      name: string;
    };

    const trimmedEmail = sanitizeEmailInput(typeof email === "string" ? email : "");
    const trimmedName = typeof name === "string" ? name.trim() : "";

    if (!plan || !trimmedEmail || !trimmedName) {
      return NextResponse.json(
        { error: "Заповніть всі поля" },
        { status: 400 }
      );
    }

    // The subscription row and the Hutko `access_email` are both written from
    // this value, and the account is created on it after payment. A malformed
    // address would only fail later, at Auth user creation, leaving a paid
    // subscription with no access, so reject it before any payment starts.
    const emailError = getEmailValidationError(trimmedEmail);
    if (emailError) {
      return NextResponse.json(
        { error: emailError },
        { status: 400 }
      );
    }

    if (!isPlanId(plan)) {
      return NextResponse.json(
        { error: "Невідомий тарифний план" },
        { status: 400 }
      );
    }

    // Plans off sale (month) are kept in PLAN_CONFIG only for renewals and callbacks;
    // never start a new checkout.
    if (!isPlanPurchasable(plan)) {
      return NextResponse.json(
        { error: "Цей тариф зараз недоступний. Оберіть інший пакет на сторінці тарифів." },
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
    const checkoutCorrelationId = `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const isRecurring = planConfig.isRecurring;
    const merchantData = JSON.stringify({
      plan,
      name: trimmedName,
      email: trimmedEmail,
      access_email: trimmedEmail,
      order_id: orderId,
      checkout_correlation_id: checkoutCorrelationId,
    });

    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const { error: dbError } = await supabase.from("subscriptions").insert({
      order_id: orderId,
      email: trimmedEmail,
      customer_name: trimmedName,
      plan,
      // The mobile app and apply_hutko_renewal read plan_type: club is stored as 'year'.
      plan_type: planConfig.planType,
      amount: planConfig.amount,
      currency: "UAH",
      status: "pending",
      payment_provider: "hutko",
      checkout_correlation_id: checkoutCorrelationId,
      platform: "web",
      auto_renewal: isRecurring,
      // Card token saved at checkout; /api/payment/recurring charges renewals with the amount from lib/plans.ts.
      recurring_mode: resolveApiCheckoutRecurringMode(isRecurring),
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

    // Hutko hosted payment page with the amount from lib/plans.ts (no payment-link button).
    // After payment Hutko returns the customer to /api/payment/redirect → /checkout status page.
    let checkoutUrl: string;
    try {
      checkoutUrl = await createHutkoCheckoutUrl({
        merchantId: MERCHANT_ID,
        password: MERCHANT_PASSWORD,
        params: {
          order_id: orderId,
          order_desc: planConfig.paymentDescription,
          amount: planConfig.amount,
          currency: "UAH",
          lang: "uk",
          sender_email: trimmedEmail,
          merchant_data: merchantData,
          server_callback_url: `${origin}/api/payment/callback`,
          response_url: `${origin}/api/payment/redirect?order_id=${encodeURIComponent(orderId)}&correlation_id=${encodeURIComponent(checkoutCorrelationId)}`,
          ...(isRecurring ? { required_rectoken: "Y" } : {}),
        },
      });
    } catch (error) {
      console.error("[Payment Create] Hutko checkout error:", error instanceof Error ? error.message : "unknown");
      return NextResponse.json(
        { error: "Не вдалося відкрити сторінку оплати. Спробуйте ще раз за хвилину." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      order_id: orderId,
      checkout_correlation_id: checkoutCorrelationId,
      checkout_url: checkoutUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

