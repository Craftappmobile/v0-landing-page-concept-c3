/**
 * Разове прибирання «мертвих» рекурентних підписок.
 *
 * Фаза 1 — hard-block токени (payment_failure_code 1014/1015/1017/1141):
 *   зупиняє розклад на боці Hutko, вимикає auto_renewal, переводить recurring_mode у none.
 * Фаза 2 — протерміновані підписки:
 *   переводить status active -> expired, якщо expires_at минув понад grace-days тому.
 *   auto_renewal не чіпає: розклад Hutko може легально продовжити підписку,
 *   а apply_hutko_renewal сам повертає status у active.
 *
 * Запуск (dry-run):
 *   npm run cleanup:recurring
 * Застосувати зміни:
 *   npm run cleanup:recurring -- --apply
 */

import { createAdminClient } from "../lib/supabase.ts"
import { stopHutkoSubscription } from "../lib/hutko.ts"
import { listHutkoHardBlockFailureCodes } from "../lib/payment-flow.ts"

const APPLY = process.argv.includes("--apply")
const GRACE_DAYS = Number(
  process.argv.find((arg) => arg.startsWith("--grace-days="))?.split("=")[1] ?? "3",
)

const MERCHANT_ID = process.env.HUTKO_MERCHANT_ID || ""
const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || ""

type Row = {
  id: string
  order_id: string | null
  email: string | null
  plan: string | null
  status: string | null
  auto_renewal: boolean | null
  recurring_mode: string | null
  expires_at: string | null
  payment_failure_code: string | null
}

const SELECT_COLUMNS = "id, order_id, email, plan, status, auto_renewal, recurring_mode, expires_at, payment_failure_code"

function label(row: Row): string {
  return `${row.email || "—"} / ${row.order_id || "(no order_id)"}`
}

async function cleanupHardBlocked(supabase: ReturnType<typeof createAdminClient>, now: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(SELECT_COLUMNS)
    .in("payment_failure_code", listHutkoHardBlockFailureCodes())
    .eq("auto_renewal", true)

  if (error) throw error
  const rows = (data || []) as Row[]

  console.log(`\n=== Фаза 1: hard-block токени (${rows.length}) ===`)

  for (const row of rows) {
    const expired = row.expires_at ? Date.parse(row.expires_at) < Date.parse(now) : false
    const needsStop = Boolean(row.order_id) && row.recurring_mode === "hutko_schedule"

    console.log(
      `- ${label(row)} | code=${row.payment_failure_code} | stop=${needsStop ? "yes" : "no"}`
      + ` | status: ${row.status}${expired ? " -> expired" : " (без змін)"}`,
    )

    if (!APPLY) continue

    let stopped = !needsStop
    if (needsStop) {
      try {
        await stopHutkoSubscription({
          orderId: row.order_id as string,
          merchantId: MERCHANT_ID,
          password: MERCHANT_PASSWORD,
        })
        stopped = true
      } catch (stopError) {
        console.error(`  ! stop не вдався: ${String(stopError)}`)
      }
    }

    const update: Record<string, string | boolean | null> = {
      auto_renewal: false,
      cancelled_at: now,
      updated_at: now,
    }

    if (stopped) {
      update.recurring_mode = "none"
      update.recurring_mode_source = "payment_failure_cleanup"
      update.cancellation_last_error_code = null
    } else {
      update.recurring_mode_source = "payment_failure_stop_failed"
      update.cancellation_last_error_code = "hutko_stop_failed_after_payment_failure"
    }

    if (expired) update.status = "expired"

    const { error: updateError } = await supabase.from("subscriptions").update(update).eq("id", row.id)
    if (updateError) console.error(`  ! update не вдався: ${updateError.message}`)
  }

  return rows.length
}

async function expireStaleSubscriptions(supabase: ReturnType<typeof createAdminClient>, now: string) {
  const cutoff = new Date(Date.parse(now) - GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("subscriptions")
    .select(SELECT_COLUMNS)
    .eq("status", "active")
    .lt("expires_at", cutoff)

  if (error) throw error
  const rows = (data || []) as Row[]

  console.log(`\n=== Фаза 2: протерміновані понад ${GRACE_DAYS} дн. (${rows.length}) ===`)

  for (const row of rows) {
    console.log(`- ${label(row)} | expires_at=${row.expires_at} | active -> expired`)
  }

  if (APPLY && rows.length > 0) {
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ status: "expired", updated_at: now })
      .in("id", rows.map((row) => row.id))
    if (updateError) console.error(`  ! update не вдався: ${updateError.message}`)
  }

  return rows.length
}

async function main() {
  if (APPLY && (!MERCHANT_ID || !MERCHANT_PASSWORD)) {
    throw new Error("HUTKO_MERCHANT_ID / HUTKO_MERCHANT_PASSWORD не задані")
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()

  console.log(APPLY ? "РЕЖИМ: --apply (зміни будуть записані)" : "РЕЖИМ: dry-run (нічого не змінюється)")

  const hardBlocked = await cleanupHardBlocked(supabase, now)
  const stale = await expireStaleSubscriptions(supabase, now)

  console.log(`\nГотово. hard-block: ${hardBlocked}, протерміновані: ${stale}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
