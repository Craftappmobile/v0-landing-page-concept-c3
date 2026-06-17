export const PLAN_IDS = ["quarter", "half", "year", "forever"] as const

export type PlanId = (typeof PLAN_IDS)[number]

export type PlanConfig = {
  id: PlanId
  name: string
  hutkoButtonId: string
  checkoutLabel: string
  pricingTabLabel: string
  pricingPeriodLabel: string
  priceValue: string
  priceWithCurrency: string
  perMonthLabel: string
  badge: string | null
  amount: number
  renewalAmount: number | null
  days: number
  isRecurring: boolean
  paymentDescription: string
  recurringDescription: string | null
  renewalNotice: string | null
  termsLabel: string
}

const PLAN_DETAILS = {
  quarter: {
    name: "Підписка на 3 місяці",
    hutkoButtonId: "5b783977dd40be7328b22c6c355d626591c76cd3",
    checkoutLabel: "3 місяці",
    pricingTabLabel: "3 місяці",
    pricingPeriodLabel: "3 міс",
    priceValue: "454",
    priceWithCurrency: "454 грн",
    perMonthLabel: "Перший платіж за 3 місяці",
    badge: null,
    amount: 45400,
    renewalAmount: 45400,
    days: 90,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 3 місяці",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 3 місяці (автопродовження)",
    renewalNotice: "Наступний платіж через 3 місяці — 454 грн.",
    termsLabel: "Преміум на 3 місяці",
  },
  half: {
    name: "Підписка на 6 місяців",
    hutkoButtonId: "15f07a1fe848da2c47c16efcf1cd1c52d5160595",
    checkoutLabel: "6 місяців",
    pricingTabLabel: "6 місяців",
    pricingPeriodLabel: "6 міс",
    priceValue: "599",
    priceWithCurrency: "599 грн",
    perMonthLabel: "Перший платіж за 6 місяців",
    badge: null,
    amount: 59900,
    renewalAmount: 59900,
    days: 180,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 6 місяців",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 6 місяців (автопродовження)",
    renewalNotice: "Наступний платіж через 6 місяців — 599 грн.",
    termsLabel: "Преміум на 6 місяців",
  },
  year: {
    name: "Річна підписка",
    hutkoButtonId: "5730471c8749e0f0ccb54c08e01394ec886f8c23",
    checkoutLabel: "12 місяців",
    pricingTabLabel: "Річна",
    pricingPeriodLabel: "рік",
    priceValue: "918",
    priceWithCurrency: "918 грн",
    perMonthLabel: "Перший платіж за 1 рік",
    badge: null,
    amount: 91800,
    renewalAmount: 91800,
    days: 365,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 12 місяців",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 12 місяців (автопродовження)",
    renewalNotice: "Наступний платіж через 1 рік — 918 грн.",
    termsLabel: "Преміум на рік",
  },
  forever: {
    name: "Безлімітна підписка (назавжди)",
    hutkoButtonId: "59c57623f890ece7d8fad1c030edc49699537392",
    checkoutLabel: "Довічна",
    pricingTabLabel: "Назавжди",
    pricingPeriodLabel: "одноразово",
    priceValue: "4680",
    priceWithCurrency: "4680 грн",
    perMonthLabel: "Довічний доступ",
    badge: null,
    amount: 468000,
    renewalAmount: null,
    days: 36500,
    isRecurring: false,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — Довічна",
    recurringDescription: null,
    renewalNotice: "Одноразовий платіж без автопродовження.",
    termsLabel: "Довічний доступ",
  },
} satisfies Record<PlanId, Omit<PlanConfig, "id">>

export const PLAN_CONFIG = PLAN_DETAILS

export const PLAN_LIST: PlanConfig[] = PLAN_IDS.map((id) => ({
  id,
  ...PLAN_DETAILS[id],
}))

export function isPlanId(value: string): value is PlanId {
  return value in PLAN_DETAILS
}

export function getPlanRenewalAmount(planId: PlanId): number {
  const plan = PLAN_CONFIG[planId]
  return plan.renewalAmount ?? plan.amount
}