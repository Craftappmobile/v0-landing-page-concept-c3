import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendCancellationEmail } from "@/lib/email";
import { stopHutkoSubscription } from "@/lib/hutko";
import {
  CANCELLABLE_SUBSCRIPTION_STATUSES,
  CANCELLATION_SUBSCRIPTION_SELECT,
  getCancellationEmailPattern,
  getHutkoScheduleOrderIds,
  normalizeCancellationEmail,
} from "@/lib/cancel-subscription";
import type { CancellableSubscription } from "@/lib/cancel-subscription";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

/**
 * Disable subscription auto-renewal by email.
 * Keeps the current paid period active and only prevents future recurring charges.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };
    const normalizedEmail = normalizeCancellationEmail(email);

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email обов'язковий" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const emailPattern = getCancellationEmailPattern(normalizedEmail);

    // Find subscriptions that still have auto-renewal enabled for this email.
    // Includes legacy failed rows left behind by reversed Hutko callbacks.
    const { data: subs, error } = await supabase
      .from("subscriptions")
      .select(CANCELLATION_SUBSCRIPTION_SELECT)
      .ilike("email", emailPattern)
      .in("status", CANCELLABLE_SUBSCRIPTION_STATUSES)
      .eq("auto_renewal", true);

    if (error) {
      console.error("[Cancel] DB error:", error);
      return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
    }

    if (!subs || subs.length === 0) {
      return NextResponse.json({
        error: "Підписок з увімкненим автопродовженням для цього email не знайдено",
      }, { status: 404 });
    }

    const subscriptions = subs as CancellableSubscription[];
    let hutkoOrderIds: string[];

    try {
      hutkoOrderIds = getHutkoScheduleOrderIds(subscriptions);
    } catch (error) {
      console.error("[Cancel] Subscription cannot be cancelled safely:", error);
      return NextResponse.json({ error: "Не вдалося визначити платіжну підписку" }, { status: 409 });
    }

    // Stop every Hutko-managed schedule before changing local state. If Hutko rejects
    // any request, keep the DB unchanged so the customer never receives false confirmation.
    try {
      await Promise.all(hutkoOrderIds.map((orderId) => stopHutkoSubscription({
        orderId,
        merchantId: MERCHANT_ID,
        password: MERCHANT_PASSWORD,
      })));
    } catch (error) {
      console.error("[Cancel] Hutko schedule stop failed:", error);
      return NextResponse.json({
        error: "Hutko не підтвердив скасування. Спробуйте пізніше або зверніться в підтримку",
      }, { status: 502 });
    }

    // Disable local renewal only after Hutko confirmed all schedule stops.
    const now = new Date().toISOString();
    const subscriptionIds = subscriptions.map((subscription) => subscription.id);
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renewal: false,
        recurring_mode: "none",
        cancelled_at: now,
        updated_at: now,
      })
      .in("id", subscriptionIds);

    if (updateError) {
      console.error("[Cancel] Update error after Hutko stop:", updateError);
      return NextResponse.json({
        error: "Платіж зупинено, але не вдалося оновити статус. Зверніться в підтримку",
      }, { status: 500 });
    }

    console.log(
      `[Cancel] Stopped ${hutkoOrderIds.length} Hutko schedule(s) and disabled auto-renewal for ${subscriptions.length} subscription(s)`,
    );

    // Send cancellation confirmation email
    const firstSub = subs[0];
    console.log("[Cancel] Sending cancellation email to:", normalizedEmail);
    const emailResult = await sendCancellationEmail(normalizedEmail, firstSub?.customer_name || "", firstSub?.plan || "");
    console.log("[Cancel] Email result:", JSON.stringify(emailResult));

    return NextResponse.json({
      message: "Автопродовження вимкнено",
      updated: subscriptions.length,
      hutko_schedules_stopped: hutkoOrderIds.length,
    });
  } catch {
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

