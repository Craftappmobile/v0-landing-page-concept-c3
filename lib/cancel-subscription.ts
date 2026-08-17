export const CANCELLATION_SUBSCRIPTION_SELECT =
  "id, order_id, plan, customer_name, payment_provider, recurring_mode";
export const CANCELLABLE_SUBSCRIPTION_STATUSES = ["active", "failed"] as const;

export type CancellableSubscription = {
  id: string;
  order_id: string | null;
  plan: string | null;
  customer_name: string | null;
  payment_provider: string | null;
  recurring_mode: string | null;
};

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