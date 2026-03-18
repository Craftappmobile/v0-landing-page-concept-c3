import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendCancellationEmail } from "@/lib/email";

/**
 * Cancel subscription by email.
 * Sets status to 'cancelled' and records cancelled_at timestamp.
 * The recurring cron job will skip cancelled subscriptions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email) {
      return NextResponse.json({ error: "Email обов'язковий" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Find active subscriptions for this email
    const { data: subs, error } = await supabase
      .from("subscriptions")
      .select("id, order_id, plan, status, customer_name")
      .eq("email", email)
      .eq("status", "active");

    if (error) {
      console.error("[Cancel] DB error:", error);
      return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
    }

    if (!subs || subs.length === 0) {
      return NextResponse.json({
        error: "Активних підписок з цим email не знайдено",
      }, { status: 404 });
    }

    // Cancel all active subscriptions for this email
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        auto_renewal: false,
        cancelled_at: now,
        updated_at: now,
      })
      .eq("email", email)
      .eq("status", "active");

    if (updateError) {
      console.error("[Cancel] Update error:", updateError);
      return NextResponse.json({ error: "Помилка скасування" }, { status: 500 });
    }

    console.log(`[Cancel] Cancelled ${subs.length} subscription(s) for ${email}`);

    // Send cancellation confirmation email (non-blocking)
    const firstSub = subs[0];
    sendCancellationEmail(email, firstSub?.customer_name || "", firstSub?.plan || "").catch(
      (err) => console.error("[Cancel] Email send failed:", err)
    );

    return NextResponse.json({
      message: "Підписку скасовано",
      cancelled: subs.length,
    });
  } catch {
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

