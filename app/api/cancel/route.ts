import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendCancellationEmail } from "@/lib/email";
import { stopHutkoSubscription } from "@/lib/hutko";
import {
  CANCELLABLE_SUBSCRIPTION_STATUSES,
  CANCELLATION_SUBSCRIPTION_SELECT,
  getCancellationEmailPattern,
  normalizeCancellationEmail,
} from "@/lib/cancel-subscription";
import type { CancellableSubscription } from "@/lib/cancel-subscription";
import { cancelOneSubscription } from "@/lib/subscription-cancellation";
import { cancelOrphanHutkoSchedules } from "@/lib/orphan-subscription-cancellation";

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || "";
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Disable subscription auto-renewal by email.
 * Keeps the current paid period active and only prevents future recurring charges.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, request_id: bodyRequestId } = body as { email: string; request_id?: string };
    const normalizedEmail = normalizeCancellationEmail(email);
    const requestId = request.headers.get("idempotency-key")?.trim() || bodyRequestId?.trim() || "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email обов'язковий" }, { status: 400 });
    }

    if (!UUID_PATTERN.test(requestId)) {
      return NextResponse.json({ error: "Некоректний ключ запиту" }, { status: 400 });
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
      .or(
        `auto_renewal.eq.true,cancellation_request_id.eq.${requestId},cancellation_state.in.(requested,provider_stopped,provider_failed,needs_review,completed)`,
      );

    if (error) {
      console.error("[Cancel] DB error:", error);
      return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
    }

    if (!subs || subs.length === 0) {
      const orphanResult = await cancelOrphanHutkoSchedules({
        supabase,
        emailPattern,
        normalizedEmail,
        requestId,
        now: new Date().toISOString(),
        stopProvider: (orderId) => stopHutkoSubscription({
          orderId,
          merchantId: MERCHANT_ID,
          password: MERCHANT_PASSWORD,
        }),
        sendConfirmation: (targetEmail) => sendCancellationEmail(targetEmail, "", ""),
      });
      if (orphanResult?.status === "provider_failed") {
        return NextResponse.json({
          status: "provider_failed",
          error: "Hutko не підтвердив зупинку знайденого автоплатежу",
          request_id: orphanResult.requestId,
        }, { status: 502 });
      }
      if (orphanResult?.status === "completed") {
        return NextResponse.json({
          status: "completed",
          message: "Автопродовження вимкнено",
          updated: 0,
          hutko_schedules_stopped: orphanResult.stopped,
          request_id: orphanResult.requestId,
        });
      }
      return NextResponse.json({
        error: "Підписок з увімкненим автопродовженням для цього email не знайдено",
      }, { status: 404 });
    }

    const subscriptions = subs as CancellableSubscription[];
    const now = new Date().toISOString();
    const results = [];

    for (const subscription of subscriptions) {
      results.push(await cancelOneSubscription({
        supabase,
        subscription,
        requestId,
        now,
        stopProvider: (orderId) => stopHutkoSubscription({
          orderId,
          merchantId: MERCHANT_ID,
          password: MERCHANT_PASSWORD,
        }),
      }));
    }

    const providerFailures = results.filter((result) => result.outcome === "provider_failed");
    const manualReviews = results.filter((result) => result.outcome === "manual_review");
    const pending = results.filter((result) => result.outcome === "pending");
    const effectiveRequestId = results[0]?.requestId || requestId;

    if (providerFailures.length > 0) {
      return NextResponse.json({
        status: "provider_failed",
        error: "Hutko не підтвердив скасування. Повторіть запит або зверніться в підтримку",
        request_id: effectiveRequestId,
      }, { status: 502 });
    }

    if (manualReviews.length > 0) {
      return NextResponse.json({
        status: "manual_review",
        error: "Підписка потребує ручної перевірки. Майбутнє списання ще не підтверджено як зупинене",
        request_id: effectiveRequestId,
      }, { status: 409 });
    }

    if (pending.length > 0) {
      return NextResponse.json({
        status: "pending",
        message: "Запит прийнято. Автопродовження буде зупинено після завершення обробки платежу",
        request_id: effectiveRequestId,
      }, { status: 202 });
    }

    const firstSub = subscriptions[0];
    const { data: emailClaim, error: emailClaimError } = await supabase
      .from("subscriptions")
      .update({ cancellation_email_sent_at: now, updated_at: now })
      .eq("id", firstSub.id)
      .is("cancellation_email_sent_at", null)
      .select("id")
      .maybeSingle();

    if (emailClaimError) throw emailClaimError;
    if (emailClaim) {
      try {
        const emailResult = await sendCancellationEmail(
          normalizedEmail,
          firstSub.customer_name || "",
          firstSub.plan || "",
        );
        if (!emailResult.success) throw new Error("cancellation_email_failed");
      } catch {
        await supabase
          .from("subscriptions")
          .update({ cancellation_email_sent_at: null, updated_at: new Date().toISOString() })
          .eq("id", firstSub.id)
          .eq("cancellation_email_sent_at", now);
      }
    }

    return NextResponse.json({
      status: "completed",
      message: "Автопродовження вимкнено",
      updated: results.length,
      hutko_schedules_stopped: results.filter((result) => result.providerStopped).length,
      request_id: effectiveRequestId,
    });
  } catch (error) {
    console.error("[Cancel] Unexpected cancellation error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

