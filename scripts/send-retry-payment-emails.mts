/**
 * Одноразова розсилка листа "доступ закінчився" тим, у кого підписка
 * перейшла в expired/failed (через невдале списання або тиху зупинку
 * розкладу) і хто зараз не має жодної живої активної підписки.
 *
 * Виключає:
 *   - pending (оплату так і не завершили — їм інший меседж),
 *   - тих, у кого вже є жива active підписка,
 *   - тих, кому лист уже надсилався (renewal_retry_email_sent_at).
 *
 * Запуск (dry-run, нічого не надсилає і не пише в БД):
 *   npm run send-retry-payment-emails
 * Реальна відправка (рекомендовано — прапорець уже вписаний у скрипт,
 * нічого передавати не треба):
 *   npm run send-retry-payment-emails:apply
 * Альтернативи, якщо передаєте прапорець вручну (PowerShell з'їдає голий "--",
 * тому npm run ... -- --apply може не спрацювати):
 *   npm run send-retry-payment-emails -- --apply   (cmd/bash)
 *   APPLY=1 npm run send-retry-payment-emails
 */

import { createAdminClient } from "../lib/supabase.ts"
import { sendAccessExpiredEmail } from "../lib/email.ts"
import { selectRetryAudience, type CandidateRow } from "../lib/retry-payment-emails.ts"

// PowerShell strips a bare "--" when invoking native commands, so
// "npm run x -- --apply" may deliver no args at all. Accept several
// spellings plus the APPLY env var as equivalent triggers.
const argv = process.argv.slice(2).map((a) => a.trim().toLowerCase())
const envApply = ["1", "true", "yes"].includes((process.env.APPLY ?? "").trim().toLowerCase())
const APPLY = argv.includes("--apply") || argv.includes("apply") || argv.includes("--apply=true") || envApply
const SEND_DELAY_MS = 600 // stay comfortably under Resend's rate limit

const SELECT_COLUMNS =
  "id, email, customer_name, plan, plan_type, status, expires_at, renewal_retry_email_sent_at, updated_at, created_at"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  if (APPLY && !process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY не задано")
  }

  const supabase = createAdminClient()
  const now = new Date()

  const { data, error } = await supabase.from("subscriptions").select(SELECT_COLUMNS)
  if (error) throw error

  const audience = selectRetryAudience((data || []) as CandidateRow[], now)

  console.log(APPLY ? "РЕЖИМ: --apply (листи будуть надіслані)" : "РЕЖИМ: dry-run (нічого не надсилається)")
  console.log(`\nАудиторія (${audience.length}):`)
  for (const entry of audience) {
    console.log(`- ${entry.email} | план=${entry.planId} | ім'я="${entry.customerName}" | subscription_id=${entry.id}`)
  }

  if (!APPLY) {
    console.log("\nDry-run завершено. Запустіть з --apply, щоб реально надіслати листи.")
    return
  }

  let sent = 0
  let failed = 0

  for (const entry of audience) {
    const result = await sendAccessExpiredEmail(entry.email, entry.customerName, entry.planId)

    if (!result.success) {
      failed += 1
      console.error(`  ! не вдалося надіслати ${entry.email}: ${result.error}`)
      await sleep(SEND_DELAY_MS)
      continue
    }

    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ renewal_retry_email_sent_at: now.toISOString() })
      .eq("id", entry.id)

    if (updateError) {
      failed += 1
      console.error(`  ! лист надіслано, але не вдалося записати маркер для ${entry.email}: ${updateError.message}`)
    } else {
      sent += 1
      console.log(`  ✓ надіслано ${entry.email}`)
    }

    await sleep(SEND_DELAY_MS)
  }

  console.log(`\nГотово. Надіслано: ${sent}, помилок: ${failed}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
