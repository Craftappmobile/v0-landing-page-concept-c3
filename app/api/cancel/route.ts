import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendCancellationEmail } from "@/lib/email";

/**
 * Disable subscription auto-renewal by email.
 * Keeps the current paid period active and only prevents future recurring charges.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email) {
      return NextResponse.json({ error: "Email обов'язковий" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Find active subscriptions with auto-renewal enabled for this email
    const { data: subs, error } = await supabase
      .from("subscriptions")
      .select("id, order_id, plan, customer_name")
      .eq("email", email)
      .eq("status", "active")
      .eq("auto_renewal", true);

    if (error) {
      console.error("[Cancel] DB error:", error);
      return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
    }

    if (!subs || subs.length === 0) {
      return NextResponse.json({
        error: "Активних підписок з увімкненим автопродовженням для цього email не знайдено",
      }, { status: 404 });
    }

    // Disable auto-renewal for matching active subscriptions
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renewal: false,
        cancelled_at: now,
        updated_at: now,
      })
      .eq("email", email)
      .eq("status", "active")
      .eq("auto_renewal", true);

    if (updateError) {
      console.error("[Cancel] Update error:", updateError);
      return NextResponse.json({ error: "Помилка скасування" }, { status: 500 });
    }

    console.log(`[Cancel] Disabled auto-renewal for ${subs.length} subscription(s) for ${email}`);

    // Send cancellation confirmation email
    const firstSub = subs[0];
    console.log("[Cancel] Sending cancellation email to:", email);
    const emailResult = await sendCancellationEmail(email, firstSub?.customer_name || "", firstSub?.plan || "");
    console.log("[Cancel] Email result:", JSON.stringify(emailResult));

    return NextResponse.json({
      message: "Автопродовження вимкнено",
      updated: subs.length,
    });
  } catch {
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

