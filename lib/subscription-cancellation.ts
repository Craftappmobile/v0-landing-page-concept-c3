import type { createAdminClient } from "./supabase.ts";
import {
  getSubscriptionCancellationAction,
  type CancellableSubscription,
} from "./cancel-subscription.ts";

type AdminClient = ReturnType<typeof createAdminClient>;

export type CancellationOutcome =
  | "completed"
  | "pending"
  | "manual_review"
  | "provider_failed";

export type CancellationItemResult = {
  subscriptionId: string;
  outcome: CancellationOutcome;
  providerStopped: boolean;
  requestId: string;
};

type CancellationEventPhase = "intent" | "provider_stop" | "local_update";

async function recordCancellationEvent(args: {
  supabase: AdminClient;
  requestId: string;
  subscription: CancellableSubscription;
  phase: CancellationEventPhase;
  outcome: string;
  errorCode?: string;
}) {
  const eventKey = [args.requestId, args.subscription.id, args.phase, args.outcome].join(":");
  const { error } = await args.supabase
    .from("subscription_cancellation_events")
    .upsert({
      event_key: eventKey,
      request_id: args.requestId,
      subscription_id: args.subscription.id,
      phase: args.phase,
      outcome: args.outcome,
      provider: args.subscription.payment_provider,
      recurring_mode: args.subscription.recurring_mode,
      error_code: args.errorCode || null,
    }, { onConflict: "event_key", ignoreDuplicates: true });

  if (error) throw new Error(`Cancellation audit write failed: ${error.message}`);
}

async function updateSubscription(
  supabase: AdminClient,
  subscriptionId: string,
  values: Record<string, string | boolean | null>,
) {
  const { error } = await supabase
    .from("subscriptions")
    .update(values)
    .eq("id", subscriptionId);

  if (error) throw new Error(`Cancellation state update failed: ${error.message}`);
}

export async function cancelOneSubscription(args: {
  supabase: AdminClient;
  subscription: CancellableSubscription;
  requestId: string;
  now: string;
  stopProvider: (orderId: string) => Promise<unknown>;
}): Promise<CancellationItemResult> {
  const { supabase, subscription, now } = args;
  const requestId = subscription.cancellation_state !== "none"
    && subscription.cancellation_request_id
    ? subscription.cancellation_request_id
    : args.requestId;
  const action = getSubscriptionCancellationAction(subscription);

  if (action === "already_completed") {
    return { subscriptionId: subscription.id, outcome: "completed", providerStopped: false, requestId };
  }

  await updateSubscription(supabase, subscription.id, {
    cancellation_state: action === "manual_review" ? "needs_review" : "requested",
    cancellation_request_id: requestId,
    cancellation_requested_at: now,
    cancellation_last_error_code: null,
    updated_at: now,
  });
  await recordCancellationEvent({
    supabase, requestId, subscription, phase: "intent", outcome: "accepted",
  });

  if (action === "manual_review") {
    await updateSubscription(supabase, subscription.id, {
      auto_renewal: false,
      updated_at: now,
    });
    await recordCancellationEvent({
      supabase, requestId, subscription, phase: "local_update", outcome: "needs_review",
      errorCode: "unclassified_recurring_mode",
    });
    return { subscriptionId: subscription.id, outcome: "manual_review", providerStopped: false, requestId };
  }

  if (action === "pending_activation") {
    await updateSubscription(supabase, subscription.id, {
      auto_renewal: false,
      updated_at: now,
    });
    await recordCancellationEvent({
      supabase, requestId, subscription, phase: "local_update", outcome: "pending_activation",
    });
    return { subscriptionId: subscription.id, outcome: "pending", providerStopped: false, requestId };
  }

  let providerStopped = false;
  if (action === "provider_stop") {
    const orderId = subscription.order_id?.trim();
    if (!orderId) {
      await updateSubscription(supabase, subscription.id, {
        cancellation_state: "needs_review",
        cancellation_last_error_code: "missing_provider_order_id",
        updated_at: now,
      });
      return { subscriptionId: subscription.id, outcome: "manual_review", providerStopped: false, requestId };
    }

    try {
      await args.stopProvider(orderId);
      providerStopped = true;
      await updateSubscription(supabase, subscription.id, {
        cancellation_state: "provider_stopped",
        updated_at: now,
      });
      await recordCancellationEvent({
        supabase, requestId, subscription, phase: "provider_stop", outcome: "succeeded",
      });
    } catch {
      await updateSubscription(supabase, subscription.id, {
        cancellation_state: "provider_failed",
        cancellation_last_error_code: "hutko_stop_failed",
        updated_at: now,
      });
      await recordCancellationEvent({
        supabase, requestId, subscription, phase: "provider_stop", outcome: "failed",
        errorCode: "hutko_stop_failed",
      });
      return { subscriptionId: subscription.id, outcome: "provider_failed", providerStopped: false, requestId };
    }
  }

  await updateSubscription(supabase, subscription.id, {
    auto_renewal: false,
    recurring_mode: "none",
    recurring_mode_source: action === "provider_stop"
      ? "cancelled_hutko_schedule"
      : "cancelled_local",
    cancellation_state: "completed",
    cancellation_completed_at: now,
    cancelled_at: now,
    cancellation_last_error_code: null,
    updated_at: now,
  });
  await recordCancellationEvent({
    supabase, requestId, subscription, phase: "local_update", outcome: "completed",
  });

  return { subscriptionId: subscription.id, outcome: "completed", providerStopped, requestId };
}
