import type { createAdminClient } from "./supabase.ts";
import { extractLegacyRecurringParentOrder } from "./payment-flow.ts";

type AdminClient = ReturnType<typeof createAdminClient>;

type OrphanRecurringEvent = {
  id: string;
  order_id: string | null;
  cancellation_request_id: string | null;
  cancellation_completed_at: string | null;
  cancellation_email_sent_at: string | null;
};

export async function cancelOrphanHutkoSchedules(args: {
  supabase: AdminClient;
  emailPattern: string;
  normalizedEmail: string;
  requestId: string;
  now: string;
  stopProvider: (orderId: string) => Promise<unknown>;
  sendConfirmation: (email: string) => Promise<{ success: boolean }>;
}) {
  const { data, error } = await args.supabase
    .from("payment_callback_events")
    .select("id, order_id, cancellation_request_id, cancellation_completed_at, cancellation_email_sent_at")
    .or(`access_email.ilike.${args.emailPattern},payer_email.ilike.${args.emailPattern}`)
    .eq("order_status", "approved")
    .like("order_id", "recurring\\_\\_%")
    .limit(100);

  if (error) throw error;
  const recurringEvents = ((data || []) as OrphanRecurringEvent[])
    .map((event) => ({ event, parentOrder: extractLegacyRecurringParentOrder(event.order_id) }))
    .filter((item): item is { event: OrphanRecurringEvent; parentOrder: string } => Boolean(item.parentOrder));
  if (recurringEvents.length === 0) return null;

  const groups = new Map<string, OrphanRecurringEvent[]>();
  for (const item of recurringEvents) {
    groups.set(item.parentOrder, [...(groups.get(item.parentOrder) || []), item.event]);
  }

  let stopped = 0;
  let responseRequestId = args.requestId;
  for (const [parentOrder, groupedEvents] of groups) {
    const incompleteEvents = groupedEvents.filter((event) => !event.cancellation_completed_at);
    const groupRequestId = groupedEvents.find((event) => event.cancellation_request_id)
      ?.cancellation_request_id || args.requestId;
    if (responseRequestId === args.requestId && groupRequestId !== args.requestId) {
      responseRequestId = groupRequestId;
    }
    if (incompleteEvents.length === 0) continue;

    try {
      await args.stopProvider(parentOrder);
    } catch {
      await args.supabase.from("payment_callback_events").update({
        cancellation_request_id: groupRequestId,
        processing_status: "needs_review",
        reason: "orphan_schedule_stop_failed",
      }).in("id", incompleteEvents.map((event) => event.id));
      return { status: "provider_failed" as const, requestId: groupRequestId, stopped };
    }

    const { error: updateError } = await args.supabase.from("payment_callback_events").update({
      cancellation_request_id: groupRequestId,
      cancellation_completed_at: args.now,
      processing_status: "processed",
      reason: "orphan_schedule_cancelled",
    }).in("id", incompleteEvents.map((event) => event.id));
    if (updateError) throw updateError;

    await args.supabase.from("subscription_cancellation_events").upsert({
      event_key: `${groupRequestId}:orphan:${incompleteEvents[0].id}:provider_stop:succeeded`,
      request_id: groupRequestId,
      subscription_id: null,
      phase: "provider_stop",
      outcome: "orphan_schedule_cancelled",
      provider: "hutko",
      recurring_mode: "hutko_schedule",
    }, { onConflict: "event_key", ignoreDuplicates: true });
    stopped += 1;
  }

  const emailEvent = recurringEvents[0].event;
  const { data: emailClaim } = await args.supabase.from("payment_callback_events")
    .update({ cancellation_email_sent_at: args.now })
    .eq("id", emailEvent.id)
    .is("cancellation_email_sent_at", null)
    .select("id")
    .maybeSingle();
  if (emailClaim) {
    try {
      const emailResult = await args.sendConfirmation(args.normalizedEmail);
      if (!emailResult.success) throw new Error("cancellation_email_failed");
    } catch {
      await args.supabase.from("payment_callback_events")
        .update({ cancellation_email_sent_at: null })
        .eq("id", emailEvent.id)
        .eq("cancellation_email_sent_at", args.now);
    }
  }

  return { status: "completed" as const, requestId: responseRequestId, stopped };
}
