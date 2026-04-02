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
  days: number
  isRecurring: boolean
  paymentDescription: string
  recurringDescription: string | null
  termsLabel: string
}

const PLAN_DETAILS = {
  quarter: {
    name: "Підписка на 3 місяці",
    hutkoButtonId: "502c8f543460cd98575ee4d04fe839983389b911",
    checkoutLabel: "3 місяці",
    pricingTabLabel: "3 місяці",
    pricingPeriodLabel: "3 міс",
    priceValue: "2 274.80",
    priceWithCurrency: "2 274.80 грн",
    perMonthLabel: "758.27 грн/місяць",
    badge: null,
    amount: 227480,
    days: 90,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 3 місяці",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 3 місяці (автопродовження)",
    termsLabel: "Преміум на 3 місяці",
  },
  half: {
    name: "Підписка на 6 місяців",
    hutkoButtonId: "a13641e52c47f06c7bac5488d0fef443dee458ca",
    checkoutLabel: "6 місяців",
    pricingTabLabel: "6 місяців",
    pricingPeriodLabel: "6 міс",
    priceValue: "2 999.95",
    priceWithCurrency: "2 999.95 грн",
    perMonthLabel: "500 грн/місяць",
    badge: null,
    amount: 299995,
    days: 180,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 6 місяців",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 6 місяців (автопродовження)",
    termsLabel: "Преміум на 6 місяців",
  },
  year: {
    name: "Річна підписка",
    hutkoButtonId: "a71624c5619178cb92ac074abf30736545c16095",
    checkoutLabel: "12 місяців",
    pricingTabLabel: "Річна",
    pricingPeriodLabel: "рік",
    priceValue: "4 590",
    priceWithCurrency: "4 590 грн",
    perMonthLabel: "382.50 грн/місяць",
    badge: null,
    amount: 459000,
    days: 365,
    isRecurring: true,
    paymentDescription: "Підписка «Розрахуй і В'яжи» — 12 місяців",
    recurringDescription: "Підписка «Розрахуй і В'яжи» — 12 місяців (автопродовження)",
    termsLabel: "Преміум на рік",
  },
  forever: {
    name: "Безлімітна підписка (назавжди)",
    hutkoButtonId: "4b4eed88c7256f7781b201bf1419c7b7a1a03cb9",
    checkoutLabel: "Довічна",
    pricingTabLabel: "Назавжди",
    pricingPeriodLabel: "одноразово",
    priceValue: "22 925",
    priceWithCurrency: "22 925 грн",
    perMonthLabel: "Довічний доступ",
    badge: null,
    amount: 2292500,
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