import { isPlanId, type PlanId } from "./plans.ts"

/**
 * Pure audience-selection logic for the one-off "access expired" win-back
 * email (scripts/send-retry-payment-emails.mts). Kept separate from the
 * script so it can be unit-tested without a real Supabase client.
 */

export type CandidateRow = {
  id: string
  email: string | null
  customer_name: string | null
  plan: string | null
  plan_type: string | null
  status: string | null
  expires_at: string | null
  renewal_retry_email_sent_at: string | null
  updated_at: string | null
  created_at: string | null
}

export type RetryAudienceEntry = {
  id: string
  email: string
  customerName: string
  planId: PlanId
}

const DEFAULT_PLAN_ID: PlanId = "year"
const ELIGIBLE_STATUSES = new Set(["expired", "failed"])

export function normalizeEmail(email: string | null | undefined): string | null {
  const trimmed = (email ?? "").trim().toLowerCase()
  return trimmed || null
}

function resolvePlanId(row: CandidateRow): PlanId {
  if (row.plan_type && isPlanId(row.plan_type)) return row.plan_type
  if (row.plan && isPlanId(row.plan)) return row.plan
  return DEFAULT_PLAN_ID
}

function latestTimestamp(row: CandidateRow): number {
  const value = row.updated_at || row.created_at
  const parsed = value ? Date.parse(value) : Number.NaN
  return Number.isNaN(parsed) ? 0 : parsed
}

function hasLiveActiveSubscription(rows: CandidateRow[], nowMs: number): boolean {
  return rows.some((row) => {
    if (row.status !== "active") return false
    const expiry = row.expires_at ? Date.parse(row.expires_at) : Number.NaN
    return !Number.isNaN(expiry) && expiry > nowMs
  })
}

/**
 * Selects the win-back audience: one entry per email, based on that email's
 * most recently updated subscription row, excluding:
 * - emails that currently have a live active subscription (already paid),
 * - rows whose status is not expired/failed (e.g. pending — never completed checkout),
 * - emails whose latest eligible row already has the email marker set.
 */
export function selectRetryAudience(rows: CandidateRow[], now: Date = new Date()): RetryAudienceEntry[] {
  const nowMs = now.getTime()
  const byEmail = new Map<string, CandidateRow[]>()

  for (const row of rows) {
    const email = normalizeEmail(row.email)
    if (!email) continue
    const group = byEmail.get(email)
    if (group) group.push(row)
    else byEmail.set(email, [row])
  }

  const result: RetryAudienceEntry[] = []

  for (const [email, group] of byEmail) {
    if (hasLiveActiveSubscription(group, nowMs)) continue

    const eligible = group.filter((row) => row.status && ELIGIBLE_STATUSES.has(row.status))
    if (eligible.length === 0) continue

    eligible.sort((a, b) => latestTimestamp(b) - latestTimestamp(a))
    const latest = eligible[0]

    if (latest.renewal_retry_email_sent_at) continue

    result.push({
      id: latest.id,
      email,
      customerName: latest.customer_name || "",
      planId: resolvePlanId(latest),
    })
  }

  return result
}
