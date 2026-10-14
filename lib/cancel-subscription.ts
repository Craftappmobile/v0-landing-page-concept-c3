export const CANCELLATION_SUBSCRIPTION_SELECT =
  "id, order_id, plan, plan_type, user_id, customer_name, payment_provider, recurring_mode, recurring_mode_source, status, auto_renewal, cancellation_state, cancellation_request_id, cancellation_completed_at";
export const CANCELLABLE_SUBSCRIPTION_STATUSES = ["pending", "active", "failed"] as const;

export type CancellableSubscription = {
  id: string;
  order_id: string | null;
  plan: string | null;
  customer_name: string | null;
  payment_provider: string | null;
  recurring_mode: string | null;
  status: string | null;
  auto_renewal: boolean | null;
  cancellation_state: string | null;
  cancellation_request_id: string | null;
  plan_type?: string | null;
  user_id?: string | null;
  recurring_mode_source?: string | null;
  cancellation_completed_at?: string | null;
};

export type SubscriptionCancellationAction =
  | "already_completed"
  | "local_only"
  | "pending_activation"
  | "provider_stop"
  | "manual_review";

export function isLegacyRecurringAttempt(subscription: CancellableSubscription): boolean {
  return subscription.status === "failed"
    && subscription.recurring_mode === "unknown"
    && subscription.order_id?.trim().toLowerCase().startsWith("recurring__") === true;
}

export function isNonRecurringSubscription(subscription: CancellableSubscription): boolean {
  return [subscription.plan, subscription.plan_type]
    .some((plan) => ["forever", "lifetime"].includes(plan?.trim().toLowerCase() || ""));
}

export function hasHutkoScheduleProvenance(subscription: CancellableSubscription): boolean {
  return subscription.payment_provider === "hutko"
    && (subscription.recurring_mode === "hutko_schedule"
      || ["hutko", "cancelled_hutko_schedule", "legacy_recurring_callback"]
        .includes(subscription.recurring_mode_source || ""));
}

export function getSubscriptionCancellationAction(
  subscription: CancellableSubscription,
): SubscriptionCancellationAction {
  if (subscription.cancellation_state === "completed" || isNonRecurringSubscription(subscription)) {
    return "already_completed";
  }

  if (subscription.cancellation_state === "provider_stopped") return "local_only";

  if (isLegacyRecurringAttempt(subscription)) return "local_only";
  if (subscription.payment_provider !== "hutko") return "manual_review";
  if (hasHutkoScheduleProvenance(subscription)) {
    // A verified renewal proves an existing schedule even if the local row is pending.
    if (subscription.status === "pending" && subscription.recurring_mode_source !== "legacy_recurring_callback") {
      return "pending_activation";
    }
    return "provider_stop";
  }
  if (subscription.recurring_mode === "merchant_token") {
    return subscription.status === "pending" ? "pending_activation" : "local_only";
  }
  return "manual_review";
}

export function getHutkoScheduleOrderIds(subscriptions: CancellableSubscription[]): string[] {
  const orderIds = new Set<string>();

  for (const subscription of subscriptions) {
    if (isNonRecurringSubscription(subscription) || subscription.cancellation_state === "completed") continue;
    if (subscription.payment_provider !== "hutko") {
      throw new Error(`Unsupported cancellation provider for subscription ${subscription.id}`);
    }

    if (subscription.recurring_mode === "merchant_token" && !hasHutkoScheduleProvenance(subscription)) {
      continue;
    }

    if (!hasHutkoScheduleProvenance(subscription)) {
      throw new Error(`Unknown recurring mode for subscription ${subscription.id}`);
    }

    const orderId = subscription.order_id?.trim();
    if (!orderId) {
      throw new Error(`Missing Hutko order_id for subscription ${subscription.id}`);
    }

    orderIds.add(orderId);
  }

  return [...orderIds];
}

export function normalizeCancellationEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;

  const normalized = email.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function escapePostgrestLikePattern(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export function getCancellationEmailPattern(normalizedEmail: string): string {
  return escapePostgrestLikePattern(normalizedEmail);
}