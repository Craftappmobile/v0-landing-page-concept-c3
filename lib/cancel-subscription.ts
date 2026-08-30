export const CANCELLATION_SUBSCRIPTION_SELECT =
  "id, order_id, plan, customer_name, payment_provider, recurring_mode, status, auto_renewal, cancellation_state, cancellation_request_id";
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

export function getSubscriptionCancellationAction(
  subscription: CancellableSubscription,
): SubscriptionCancellationAction {
  if (subscription.cancellation_state === "completed" || subscription.recurring_mode === "none") {
    return "already_completed";
  }

  if (subscription.cancellation_state === "provider_stopped") return "local_only";

  if (isLegacyRecurringAttempt(subscription)) return "local_only";
  if (subscription.payment_provider !== "hutko") return "manual_review";
  if (subscription.recurring_mode === "unknown") return "manual_review";
  if (subscription.status === "pending") return "pending_activation";
  if ((subscription.cancellation_state === "requested" || subscription.cancellation_state === "provider_failed")
      && subscription.recurring_mode === "hutko_schedule") {
    return "provider_stop";
  }
  if (subscription.auto_renewal !== true) return "already_completed";
  if (subscription.recurring_mode === "merchant_token") return "local_only";
  if (subscription.recurring_mode === "hutko_schedule") return "provider_stop";
  return "manual_review";
}

export function getHutkoScheduleOrderIds(subscriptions: CancellableSubscription[]): string[] {
  const orderIds = new Set<string>();

  for (const subscription of subscriptions) {
    if (subscription.payment_provider !== "hutko") {
      throw new Error(`Unsupported cancellation provider for subscription ${subscription.id}`);
    }

    if (subscription.recurring_mode === "merchant_token" || subscription.recurring_mode === "none") {
      continue;
    }

    if (subscription.recurring_mode !== "hutko_schedule") {
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