import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendCancellationEmail } from "@/lib/email";
import {
  CANCELLABLE_SUBSCRIPTION_STATUSES,
  CANCELLATION_SUBSCRIPTION_SELECT,
  getCancellationEmailPattern,
  normalizeCancellationEmail,
} from "@/lib/cancel-subscription";

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

    // Disable auto-renewal for matching subscriptions without removing current access.
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renewal: false,
        cancelled_at: now,
        updated_at: now,
      })
      .ilike("email", emailPattern)
      .in("status", CANCELLABLE_SUBSCRIPTION_STATUSES)
      .eq("auto_renewal", true);

    if (updateError) {
      console.error("[Cancel] Update error:", updateError);
      return NextResponse.json({ error: "Помилка скасування" }, { status: 500 });
    }

    console.log(`[Cancel] Disabled auto-renewal for ${subs.length} subscription(s) for ${normalizedEmail}`);

    // Send cancellation confirmation email
    const firstSub = subs[0];
    console.log("[Cancel] Sending cancellation email to:", normalizedEmail);
    const emailResult = await sendCancellationEmail(normalizedEmail, firstSub?.customer_name || "", firstSub?.plan || "");
    console.log("[Cancel] Email result:", JSON.stringify(emailResult));

    return NextResponse.json({
      message: "Автопродовження вимкнено",
      updated: subs.length,
    });
  } catch {
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

