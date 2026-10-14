import type { createAdminClient } from "./supabase.ts";
import { extractLegacyRecurringParentOrder } from "./payment-flow.ts";
import {
  CANCELLABLE_SUBSCRIPTION_STATUSES,
  CANCELLATION_SUBSCRIPTION_SELECT,
  escapePostgrestLikePattern,
  hasHutkoScheduleProvenance,
  isNonRecurringSubscription,
  type CancellableSubscription,
} from "./cancel-subscription.ts";

type AdminClient = ReturnType<typeof createAdminClient>;
type ScheduleEvidence = {
  provider: string;
  event_type: string;
  reason: string;
  order_id: string | null;
  merchant_order_id: string | null;
  order_status: string | null;
  received_at: string;
};

/** Server-only lookup: retain disabled historical Hutko rows and account-linked rows without email. */
export async function findCancellationSubscriptions(args: {
  supabase: AdminClient;
  emailPattern: string;
  requestId: string;
}): Promise<CancellableSubscription[]> {
  const [emailRows, profiles] = await Promise.all([
    args.supabase.from("subscriptions").select(CANCELLATION_SUBSCRIPTION_SELECT)
      .ilike("email", args.emailPattern),
    args.supabase.from("profiles").select("id").ilike("email", args.emailPattern),
  ]);
  if (emailRows.error || profiles.error) throw new Error("Cancellation account lookup failed");
  const rows = (emailRows.data || []) as CancellableSubscription[];
  const userIds = [...new Set([
    ...rows.map((row) => row.user_id),
    ...(profiles.data || []).map((profile: { id: string }) => profile.id),
  ].filter((id): id is string => Boolean(id)))];
  if (userIds.length > 0) {
    const linked = await args.supabase.from("subscriptions").select(CANCELLATION_SUBSCRIPTION_SELECT)
      .in("user_id", userIds);
    if (linked.error) throw new Error("Cancellation subscription lookup failed");
    rows.push(...((linked.data || []) as CancellableSubscription[]));
  }
  return [...new Map(rows.map((row) => [row.id, row])).values()].filter((row) =>
    !isNonRecurringSubscription(row)
    && (CANCELLABLE_SUBSCRIPTION_STATUSES.some((status) => status === row.status)
      || (row.payment_provider === "hutko" && ["cancelled", "expired"].includes(row.status || "")))
    && (row.payment_provider === "hutko" || row.auto_renewal === true
      || row.cancellation_request_id === args.requestId
      || ["requested", "provider_stopped", "provider_failed", "needs_review", "completed"]
        .includes(row.cancellation_state || "")));
}

/**
 * Reconcile one trusted server-side candidate; does not stop or charge the provider.
 * Stored renewal events come from the signature-verified callback / service-only RPC.
 * No callback email, rectoken, or local auto_renewal flag is billing-driver evidence.
 */
export async function reconcileSubscriptionCancellation(args: {
  supabase: AdminClient;
  subscription: CancellableSubscription;
  now: string;
}): Promise<CancellableSubscription> {
  const { supabase, subscription, now } = args;
  const parentOrder = subscription.order_id?.trim();
  if (subscription.payment_provider !== "hutko" || isNonRecurringSubscription(subscription)
      || !parentOrder || extractLegacyRecurringParentOrder(parentOrder)) return subscription;

  const completed = subscription.cancellation_state === "completed";
  // Without a completion timestamp we cannot prove evidence is newer; trust explicit completion.
  if (completed && !Number.isFinite(Date.parse(subscription.cancellation_completed_at || ""))) {
    return subscription;
  }
  let query = supabase.from("payment_callback_events")
    .select("provider, event_type, reason, order_id, merchant_order_id, order_status, received_at")
    .eq("provider", "hutko").eq("order_status", "approved")
    .in("event_type", ["renewal_approved", "recurring_callback_manual_review"])
    .like("order_id", `recurring\\_\\_%\\_\\_${escapePostgrestLikePattern(parentOrder)}`);
  if (completed) query = query.gt("received_at", subscription.cancellation_completed_at!);
  const { data, error } = await query.order("received_at", { ascending: false }).limit(100);
  if (error) throw new Error("Cancellation schedule evidence lookup failed");
  const evidence = ((data || []) as ScheduleEvidence[]).find((event) =>
    event.provider === "hutko" && event.order_status === "approved"
    && ((event.event_type === "renewal_approved" && ["renewal_applied", "renewal_after_unlimited", "renewal_after_cancellation"]
      .includes(event.reason))
      || (event.event_type === "recurring_callback_manual_review" && event.reason === "renewal_parent_not_found"))
    && extractLegacyRecurringParentOrder(event.order_id) === parentOrder
    && (!event.merchant_order_id || event.merchant_order_id === parentOrder)
    && (!completed || Date.parse(event.received_at) > Date.parse(subscription.cancellation_completed_at!)));

  if (completed && !evidence) return subscription;
  if (!evidence && !hasHutkoScheduleProvenance(subscription)) return subscription;
  const source = evidence ? "legacy_recurring_callback" : subscription.recurring_mode_source;
  if (!completed && subscription.recurring_mode === "hutko_schedule"
      && source === subscription.recurring_mode_source) return subscription;

  const values = {
    recurring_mode: "hutko_schedule",
    recurring_mode_source: source || "hutko",
    recurring_mode_classified_at: now,
    updated_at: now,
    ...(completed ? { cancellation_state: "requested", cancellation_completed_at: null } : {}),
  };
  let update = supabase.from("subscriptions").update(values)
    .eq("id", subscription.id).eq("order_id", subscription.order_id!)
    .eq("payment_provider", "hutko");
  // Do not overwrite a concurrent provider stop or another classifier's decision.
  for (const column of ["recurring_mode", "recurring_mode_source", "cancellation_state", "cancellation_completed_at"] as const) {
    const previous = subscription[column];
    update = previous == null ? update.is(column, null) : update.eq(column, previous);
  }
  const persisted = await update.select(CANCELLATION_SUBSCRIPTION_SELECT).maybeSingle();
  if (persisted.error || !persisted.data) throw new Error("Cancellation reconciliation changed concurrently or failed");
  return persisted.data as CancellableSubscription;
}