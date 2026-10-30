export const PLAN_IDS = ["month", "quarter", "half", "year", "club", "forever"] as const

export type PlanId = (typeof PLAN_IDS)[number]

/**
 * Values the mobile app and the SQL renewal (`apply_hutko_renewal`) understand
 * in `subscriptions.plan_type`. An unknown value breaks access in the app.
 */
export type SubscriptionPlanType = "month" | "quarter" | "half" | "year" | "forever"

export type PlanConfig = {
  id: PlanId
  name: string
  hutkoButtonId: string
  /** Written to `subscriptions.plan_type`; `subscriptions.plan` keeps the exact plan id. */
  planType: SubscriptionPlanType
  /** false — no new purchases; subscriptions bought earlier keep renewing as before. */
  isForSale: boolean
  checkoutLabel: string
  pricingTabLabel: string
  pricingPeriodLabel: string
  priceValue: string
  priceWithCurrency: string
  perMonthLabel: string
  badge: string | null
  /** Master-class gifts and discounts; yarnmk.com.ua grants them, this site only describes them. */
  masterClassBenefits: string[]
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
  month: {
    name: "Пакет «Тест»",
    hutkoButtonId: "4a0596b9b6f16656dd620a8981c0de28978d5236",
    planType: "month",
    // No longer sold; ~61 monthly subscribers still renew at 100 грн every 30 days.
    isForSale: false,
    checkoutLabel: "Тест — 1 міс",
    pricingTabLabel: "Тест",
    pricingPeriodLabel: "1 міс",
    priceValue: "100",
    priceWithCurrency: "100 грн",
    perMonthLabel: "1 місяць повного PRO-доступу",
    badge: null,
    masterClassBenefits: [],
    amount: 10000,
    renewalAmount: 10000,
    initialDays: 30,
    renewalDays: 30,
    isRecurring: true,
    paymentDescription: "Пакет «Тест» — 1 місяць PRO-доступу",
    recurringDescription: "Пакет «Тест» — щомісячне автопродовження",
    renewalNotice: "Всі можливості PRO доступні одразу після оплати. Наступний платіж через 1 місяць — 100 грн.",
    termsLabel: "Преміум Тест на 1 місяць",
  },
  quarter: {
    name: "Пакет «Старт»",
    hutkoButtonId: "4042eadb25ce283bb871bccd2c0a594bd15d1a71",
    planType: "quarter",
    isForSale: true,
    checkoutLabel: "Старт — 3 міс",
    pricingTabLabel: "Старт",
    pricingPeriodLabel: "3 міс",
    priceValue: "454",
    priceWithCurrency: "454 грн",
    perMonthLabel: "3 місяці повного PRO-доступу",
    badge: null,
    masterClassBenefits: [
      "Майстер-класи по 390 грн замість 500 (–22%)",
    ],
    amount: 45400,
    renewalAmount: 45400,
    initialDays: 90,
    renewalDays: 90,
    isRecurring: true,
    paymentDescription: "Пакет «Старт» — 3 місяці PRO-доступу",
    recurringDescription: "Пакет «Старт» — автопродовження на 3 місяці",
    renewalNotice: "Перший платіж відкриває 3 місяці PRO-доступу. Далі автопродовження кожні 3 місяці — 454 грн.",
    termsLabel: "Преміум Старт на 3 місяці",
  },
  half: {
    name: "Пакет «Оптимальний»",
    hutkoButtonId: "aa0d547477ca4e5b7a7e46a16e589a6b7dbf698b",
    planType: "half",
    isForSale: true,
    checkoutLabel: "Оптимальний — 6 міс",
    pricingTabLabel: "Оптимальний",
    pricingPeriodLabel: "6 міс",
    priceValue: "599",
    priceWithCurrency: "599 грн",
    perMonthLabel: "6 місяців повного PRO-доступу",
    badge: null,
    masterClassBenefits: [
      "Майстер-класи по 350 грн замість 500 (–30%)",
    ],
    amount: 59900,
    renewalAmount: 59900,
    initialDays: 180,
    renewalDays: 180,
    isRecurring: true,
    paymentDescription: "Пакет «Оптимальний» — 6 місяців PRO-доступу",
    recurringDescription: "Пакет «Оптимальний» — автопродовження на 6 місяців",
    renewalNotice: "Перший платіж відкриває 6 місяців PRO-доступу. Далі автопродовження кожні 6 місяців — 599 грн.",
    termsLabel: "Преміум Оптимальний на 6 місяців",
  },
  year: {
    name: "Пакет «Рік спокою»",
    hutkoButtonId: "6fe48cdf6aa487af5da4801a24a6bf0ae8adf5a7",
    planType: "year",
    isForSale: true,
    checkoutLabel: "Рік спокою — 12 міс",
    pricingTabLabel: "Рік спокою",
    pricingPeriodLabel: "12 міс",
    priceValue: "918",
    priceWithCurrency: "918 грн",
    perMonthLabel: "12 місяців повного PRO-доступу",
    badge: "Майстер-клас у подарунок 🎁",
    masterClassBenefits: [
      "1 майстер-клас на вибір у подарунок — і знову при кожному подовженні",
      "Майстер-класи по 290 грн замість 500 (–42%)",
      "Подарунків на 500 грн",
    ],
    amount: 91800,
    renewalAmount: 91800,
    initialDays: 365,
    renewalDays: 365,
    isRecurring: true,
    paymentDescription: "Пакет «Рік спокою» — 12 місяців PRO-доступу",
    recurringDescription: "Пакет «Рік спокою» — автопродовження на 12 місяців",
    renewalNotice: "Перший платіж відкриває 12 місяців PRO-доступу. Далі автопродовження кожні 12 місяців — 918 грн.",
    termsLabel: "Преміум Рік спокою на 12 місяців",
  },
  club: {
    name: "Клуб «Розрахуй і в'яжи»",
    // Paid only on yarnmk.com.ua (see PACKAGE_CHECKOUT_URL): no Hutko button on this site.
    hutkoButtonId: "",
    // Stored as plan = 'club', plan_type = 'year' (same contract as yarnmk.com.ua).
    planType: "year",
    isForSale: true,
    checkoutLabel: "Клуб — 12 міс",
    pricingTabLabel: "Клуб",
    pricingPeriodLabel: "12 міс",
    priceValue: "2490",
    priceWithCurrency: "2490 грн",
    perMonthLabel: "12 місяців повного PRO-доступу",
    badge: "8 майстер-класів у подарунок 🎁",
    masterClassBenefits: [
      "2 майстер-класи на вибір одразу",
      "6 нових майстер-класів — по одному раз на 2 місяці (і знову при подовженні)",
      "Майстер-класи по 250 грн замість 500 (–50%)",
      "Подарунків на 4000 грн за рік",
    ],
    amount: 249000,
    renewalAmount: 249000,
    initialDays: 365,
    renewalDays: 365,
    isRecurring: true,
    paymentDescription: "Клуб «Розрахуй і в'яжи» — 12 місяців PRO-доступу",
    recurringDescription: "Клуб «Розрахуй і в'яжи» — автопродовження на 12 місяців",
    renewalNotice: "Перший платіж відкриває 12 місяців PRO-доступу. Далі автопродовження кожні 12 місяців — 2490 грн.",
    termsLabel: "Клуб «Розрахуй і в'яжи» на 12 місяців",
  },
  forever: {
    name: "Пакет «V.I.P. Назавжди»",
    hutkoButtonId: "5b168b28848835eae67acaab72d8e47b3aec3d9d",
    planType: "forever",
    isForSale: true,
    checkoutLabel: "V.I.P. Назавжди",
    pricingTabLabel: "V.I.P.",
    pricingPeriodLabel: "назавжди",
    priceValue: "5490",
    priceWithCurrency: "5490 грн",
    perMonthLabel: "Одноразовий платіж, можна частинами (розстрочка ПУМБ)",
    badge: "15 майстер-класів у подарунок 🎁",
    masterClassBenefits: [
      "3 майстер-класи на вибір одразу",
      "12 нових майстер-класів у перший рік — по одному щомісяця",
      "Майстер-класи по 200 грн замість 500 (–60%) назавжди",
      "Подарунків на 7500 грн у перший рік",
    ],
    amount: 549000,
    renewalAmount: null,
    initialDays: 36500,
    renewalDays: null,
    isRecurring: false,
    paymentDescription: "Пакет «V.I.P. Назавжди» — довічний PRO-доступ",
    recurringDescription: null,
    renewalNotice: "Одноразовий платіж 5490 грн без автопродовження. Можна оплатити частинами — розстрочка ПУМБ.",
    termsLabel: "V.I.P. довічний доступ",
  },
} satisfies Record<PlanId, Omit<PlanConfig, "id">>

export const PLAN_CONFIG = PLAN_DETAILS

export const PLAN_LIST: PlanConfig[] = PLAN_IDS.map((id) => ({
  id,
  ...PLAN_DETAILS[id],
}))

export function isPlanId(value: string): value is PlanId {
  return Object.prototype.hasOwnProperty.call(PLAN_DETAILS, value)
}

/**
 * Since 30.10.2026 packages are paid on yarnmk.com.ua: one checkout for both sites, with the
 * master-class discounts, gift master classes and upgrades that live there. It accepts these
 * plan ids (quarter, half, year, club, forever) as aliases of its own package codes.
 * This site keeps renewing existing subscriptions (cron and Hutko callbacks) with PLAN_CONFIG.
 */
export const PACKAGE_CHECKOUT_URL = "https://yarnmk.com.ua/oplata/pidpyska"

export function getPackageCheckoutUrl(planId?: PlanId | null, params?: Record<string, string>): string {
  const url = new URL(PACKAGE_CHECKOUT_URL)
  if (planId && isPlanPurchasable(planId)) url.searchParams.set("plan", planId)
  for (const [key, value] of Object.entries(params ?? {})) url.searchParams.set(key, value)
  return url.toString()
}

/** Plans offered to customers (paid on yarnmk.com.ua). Renewals use PLAN_CONFIG, not this. */
export function isPlanPurchasable(planId: PlanId): boolean {
  return PLAN_CONFIG[planId].isForSale
}

/** Plans shown on pricing and terms. */
export const PURCHASABLE_PLAN_LIST: PlanConfig[] = PLAN_LIST.filter((plan) => isPlanPurchasable(plan.id))

/**
 * Resolves a stored subscription row to a plan id. `plan` wins only when it
 * refines `plan_type` (club → year); otherwise `plan_type` keeps precedence
 * as before, then `plan`.
 */
export function resolveSubscriptionPlanId(
  plan: string | null | undefined,
  planType: string | null | undefined,
): PlanId | null {
  if (plan && isPlanId(plan) && PLAN_CONFIG[plan].planType === planType) return plan
  if (planType && isPlanId(planType)) return planType
  if (plan && isPlanId(plan)) return plan
  return null
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
