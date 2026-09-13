import type { createAdminClient } from "./supabase"

/**
 * Grace period after expires_at before a subscription is marked expired.
 * Hutko-scheduled renewals may arrive with a delay, and apply_hutko_renewal
 * returns status back to active, so the grace window avoids false expirations.
 */
export const GRACE_DAYS = 3
export const MAX_BATCH = 500

export type AdminClient = ReturnType<typeof createAdminClient>

export type StaleSubscriptionRow = {
  id: string
  order_id?: string | null
  email?: string | null
  expires_at?: string | null
}

export type ExpirationSweepResult =
  | { ok: true; kind: "empty"; count: 0; message: string }
  | { ok: true; kind: "expired"; count: number; cutoff: string; truncated: boolean }
  | { ok: false; kind: "error"; error: string }

/** Cutoff timestamp: subscriptions with expires_at older than this are stale. */
export function computeExpirationCutoff(now: Date, graceDays: number = GRACE_DAYS): string {
  return new Date(now.getTime() - graceDays * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * Marks active subscriptions as expired once their paid period ended more
 * than GRACE_DAYS ago. Intentionally never touches auto_renewal: a delayed
 * Hutko schedule renewal (apply_hutko_renewal) can still legally bring the
 * subscription back to active.
 */
export async function runExpirationSweep(
  supabase: AdminClient,
  now: Date,
): Promise<ExpirationSweepResult> {
  const cutoff = computeExpirationCutoff(now)

  const { data: stale, error } = await supabase
    .from("subscriptions")
    .select("id, order_id, email, expires_at")
    .eq("status", "active")
    .lt("expires_at", cutoff)
    .order("expires_at", { ascending: true })
    .limit(MAX_BATCH)

  if (error) {
    return { ok: false, kind: "error", error: "DB error" }
  }

  const rows = (stale || []) as StaleSubscriptionRow[]

  if (rows.length === 0) {
    return { ok: true, kind: "empty", count: 0, message: "No subscriptions to expire" }
  }

  const { error: updateError } = await supabase
    .from("subscriptions")
    .update({ status: "expired", updated_at: now.toISOString() })
    .in(
      "id",
      rows.map((row) => row.id),
    )

  if (updateError) {
    return { ok: false, kind: "error", error: "Update error" }
  }

  return { ok: true, kind: "expired", count: rows.length, cutoff, truncated: rows.length === MAX_BATCH }
}
