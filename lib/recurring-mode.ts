export const RECURRING_MODE = {
  UNKNOWN: "unknown",
  HUTKO_SCHEDULE: "hutko_schedule",
  MERCHANT_TOKEN: "merchant_token",
  NONE: "none",
} as const

export type RecurringMode = (typeof RECURRING_MODE)[keyof typeof RECURRING_MODE]

/** Hutko payment-link buttons own the schedule for recurring checkout plans. */
export function resolveHutkoCheckoutRecurringMode(isRecurring: boolean): RecurringMode {
  return isRecurring ? RECURRING_MODE.HUTKO_SCHEDULE : RECURRING_MODE.NONE
}