import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { buildHutkoButtonWidgetConfig } from "@/lib/hutko";
import { isPlanId, PLAN_CONFIG } from "@/lib/plans";

const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email, name } = body as {
      plan: string;
      email: string;
      name: string;
    };

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

    if (!MERCHANT_PASSWORD) {
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
      checkout_correlation_id: checkoutCorrelationId,
    });

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
      checkout_correlation_id: checkoutCorrelationId,
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

    const hutkoConfig = buildHutkoButtonWidgetConfig({
      buttonId: planConfig.hutkoButtonId,
      serverCallbackUrl: `${origin}/api/payment/callback`,
      senderEmail: trimmedEmail,
      lang: "uk",
      merchantData,
      requiredRectoken: isRecurring ? "Y" : undefined,
    });

    return NextResponse.json({
      order_id: orderId,
      checkout_correlation_id: checkoutCorrelationId,
      hutko_config: hutkoConfig,
    });
  } catch {
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}

