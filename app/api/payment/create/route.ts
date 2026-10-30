import { NextRequest, NextResponse } from "next/server";
import { getPackageCheckoutUrl, isPlanId } from "@/lib/plans";

// Since 30.10.2026 packages are paid on yarnmk.com.ua (one checkout for both sites, with the
// master-class discounts and gifts that live there). This site no longer starts payments:
// it only renews existing subscriptions (/api/payment/recurring, /api/payment/callback).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan } = body as { plan?: unknown };

    if (typeof plan !== "string" || !isPlanId(plan)) {
      return NextResponse.json(
        { error: "Невідомий тарифний план" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Пакети тепер оформлюються на yarnmk.com.ua — там же знижки й подарункові майстер-класи.",
        checkout_url: getPackageCheckoutUrl(plan),
      },
      { status: 410 }
    );
  } catch {
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}
