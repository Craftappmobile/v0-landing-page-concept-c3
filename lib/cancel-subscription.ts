export const CANCELLATION_SUBSCRIPTION_SELECT = "id, order_id, plan, customer_name";

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