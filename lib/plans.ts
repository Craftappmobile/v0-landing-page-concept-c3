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
  initialDays: number
  renewalDays: number | null
  isRecurring: boolean
  paymentDescription: string
  recurringDescription: string | null
  renewalNotice: string | null
  termsLabel: string
}

const PLAN_DETAILS = {
  quarter: {
    name: "Пакет «Старт»",
    hutkoButtonId: "4042eadb25ce283bb871bccd2c0a594bd15d1a71",
    checkoutLabel: "Старт — 3+1 міс",
    pricingTabLabel: "Старт",
    pricingPeriodLabel: "3+1 міс",
    priceValue: "454",
    priceWithCurrency: "454 грн",
    perMonthLabel: "4 місяці доступу за ціною 3",
    badge: "1 місяць у подарунок 🎁",
    amount: 45400,
    renewalAmount: 45400,
    initialDays: 120,
    renewalDays: 90,
    isRecurring: true,
    paymentDescription: "Пакет «Старт» — 3 місяці + 1 місяць у подарунок",
    recurringDescription: "Пакет «Старт» — автопродовження на 3 місяці",
    renewalNotice: "Перший платіж відкриває 4 місяці PRO-доступу. Далі автопродовження кожні 3 місяці — 454 грн.",
    termsLabel: "Преміум Старт на 3+1 місяці",
  },
  half: {
    name: "Пакет «Оптимальний»",
    hutkoButtonId: "aa0d547477ca4e5b7a7e46a16e589a6b7dbf698b",
    checkoutLabel: "Оптимальний — 6+3 міс",
    pricingTabLabel: "Оптимальний",
    pricingPeriodLabel: "6+3 міс",
    priceValue: "599",
    priceWithCurrency: "599 грн",
    perMonthLabel: "9 місяців доступу за ціною 6",
    badge: "3 місяці у подарунок 🎁",
    amount: 59900,
    renewalAmount: 59900,
    initialDays: 270,
    renewalDays: 180,
    isRecurring: true,
    paymentDescription: "Пакет «Оптимальний» — 6 місяців + 3 місяці у подарунок",
    recurringDescription: "Пакет «Оптимальний» — автопродовження на 6 місяців",
    renewalNotice: "Перший платіж відкриває 9 місяців PRO-доступу. Далі автопродовження кожні 6 місяців — 599 грн.",
    termsLabel: "Преміум Оптимальний на 6+3 місяці",
  },
  year: {
    name: "Пакет «Рік спокою»",
    hutkoButtonId: "6fe48cdf6aa487af5da4801a24a6bf0ae8adf5a7",
    checkoutLabel: "Рік спокою — 12+6 міс",
    pricingTabLabel: "Рік спокою",
    pricingPeriodLabel: "12+6 міс",
    priceValue: "918",
    priceWithCurrency: "918 грн",
    perMonthLabel: "18 місяців доступу за ціною 12",
    badge: "6 місяців у подарунок 🎁",
    amount: 91800,
    renewalAmount: 91800,
    initialDays: 545,
    renewalDays: 365,
    isRecurring: true,
    paymentDescription: "Пакет «Рік спокою» — 12 місяців + 6 місяців у подарунок",
    recurringDescription: "Пакет «Рік спокою» — автопродовження на 12 місяців",
    renewalNotice: "Перший платіж відкриває 18 місяців PRO-доступу. Далі автопродовження кожні 12 місяців — 918 грн.",
    termsLabel: "Преміум Рік спокою на 12+6 місяців",
  },
  forever: {
    name: "Пакет «V.I.P. Назавжди»",
    hutkoButtonId: "5b168b28848835eae67acaab72d8e47b3aec3d9d",
    checkoutLabel: "V.I.P. Назавжди",
    pricingTabLabel: "V.I.P.",
    pricingPeriodLabel: "назавжди",
    priceValue: "3680",
    priceWithCurrency: "3680 грн",
    perMonthLabel: "Замість 4680 грн — економія 1000 грн",
    badge: "Знижка -1000 грн 🔥",
    amount: 368000,
    renewalAmount: null,
    initialDays: 36500,
    renewalDays: null,
    isRecurring: false,
    paymentDescription: "Пакет «V.I.P. Назавжди» — довічний доступ зі знижкою",
    recurringDescription: null,
    renewalNotice: "Одноразовий платіж 3680 грн без автопродовження.",
    termsLabel: "V.I.P. довічний доступ",
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

export function getPlanInitialAccessDays(planId: PlanId): number {
  return PLAN_CONFIG[planId].initialDays
}

export function getPlanRenewalAccessDays(planId: PlanId): number {
  const plan = PLAN_CONFIG[planId]
  return plan.renewalDays ?? plan.initialDays
}