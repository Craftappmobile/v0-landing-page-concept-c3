export const PLAN_IDS = ["quarter", "half", "year", "forever"] as const

export type PlanId = (typeof PLAN_IDS)[number]

export type PlanConfig = {
  id: PlanId
  name: string
  checkoutLabel: string
  pricingTabLabel: string
  pricingPeriodLabel: string
  priceValue: string
  priceWithCurrency: string
  perMonthLabel: string
  badge: string | null
  amount: number
  days: number
  isRecurring: boolean
  paymentDescription: string
  recurringDescription: string | null
  termsLabel: string
}

const PLAN_DETAILS = {
  quarter: {
    name: "Підписка на 3 місяці",
    checkoutLabel: "3 місяці",
    pricingTabLabel: "3 місяці",
    pricingPeriodLabel: "3 міс",
    priceValue: "454.96",
    priceWithCurrency: "454.96 грн",
    perMonthLabel: "151.65 грн/місяць",
    badge: null,
    amount: 45496,
    days: 90,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 3 місяці",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 3 місяці (автопродовження)",
    termsLabel: "Преміум на 3 місяці",
  },
  half: {
    name: "Підписка на 6 місяців",
    checkoutLabel: "6 місяців",
    pricingTabLabel: "6 місяців",
    pricingPeriodLabel: "6 міс",
    priceValue: "599.99",
    priceWithCurrency: "599.99 грн",
    perMonthLabel: "100 грн/місяць",
    badge: null,
    amount: 59999,
    days: 180,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 6 місяців",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 6 місяців (автопродовження)",
    termsLabel: "Преміум на 6 місяців",
  },
  year: {
    name: "Річна підписка",
    checkoutLabel: "12 місяців",
    pricingTabLabel: "Річна",
    pricingPeriodLabel: "рік",
    priceValue: "918",
    priceWithCurrency: "918 грн",
    perMonthLabel: "76.50 грн/місяць",
    badge: "Економія 24%",
    amount: 91800,
    days: 365,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 12 місяців",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 12 місяців (автопродовження)",
    termsLabel: "Преміум на рік",
  },
  forever: {
    name: "Безлімітна підписка (назавжди)",
    checkoutLabel: "Довічна",
    pricingTabLabel: "Назавжди",
    pricingPeriodLabel: "одноразово",
    priceValue: "4 585",
    priceWithCurrency: "4 585 грн",
    perMonthLabel: "Довічний доступ",
    badge: null,
    amount: 458500,
    days: 36500,
    isRecurring: false,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — Довічна",
    recurringDescription: null,
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