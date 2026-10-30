import assert from "node:assert/strict"

import { isPlanId, isPlanPurchasable, PLAN_CONFIG, PLAN_IDS, PLAN_LIST, PURCHASABLE_PLAN_LIST } from "../lib/plans.ts"

// plan_type values the mobile app and apply_hutko_renewal understand.
const APP_PLAN_TYPES = new Set(["month", "quarter", "half", "year", "forever"])

function priceValueToKopecks(priceValue) {
  const normalized = priceValue.replace(/\s+/g, "").replace(",", ".")

  assert.match(
    normalized,
    /^\d+(?:\.\d{1,2})?$/,
    `Invalid priceValue format: ${priceValue}`,
  )

  const [hryvnias, kopecks = ""] = normalized.split(".")
  return Number(hryvnias) * 100 + Number((kopecks + "00").slice(0, 2))
}

function requireText(label, value) {
  assert.ok(value.trim().length > 0, `${label} must not be empty`)
}

assert.equal(new Set(PLAN_IDS).size, PLAN_IDS.length, "PLAN_IDS must be unique")
assert.deepEqual(
  Object.keys(PLAN_CONFIG),
  [...PLAN_IDS],
  "PLAN_CONFIG keys must match PLAN_IDS and stay in the same order",
)
assert.deepEqual(
  PLAN_LIST.map((plan) => plan.id),
  [...PLAN_IDS],
  "PLAN_LIST ids must match PLAN_IDS",
)

for (const id of PLAN_IDS) {
  const plan = PLAN_CONFIG[id]

  requireText(`${id}.name`, plan.name)
  requireText(`${id}.checkoutLabel`, plan.checkoutLabel)
  requireText(`${id}.pricingTabLabel`, plan.pricingTabLabel)
  requireText(`${id}.pricingPeriodLabel`, plan.pricingPeriodLabel)
  requireText(`${id}.priceValue`, plan.priceValue)
  requireText(`${id}.priceWithCurrency`, plan.priceWithCurrency)
  requireText(`${id}.perMonthLabel`, plan.perMonthLabel)
  requireText(`${id}.paymentDescription`, plan.paymentDescription)
  requireText(`${id}.termsLabel`, plan.termsLabel)

  assert.equal(
    plan.amount,
    priceValueToKopecks(plan.priceValue),
    `${id}.amount must match ${id}.priceValue in kopecks`,
  )
  assert.equal(
    plan.priceWithCurrency,
    `${plan.priceValue} грн`,
    `${id}.priceWithCurrency must match priceValue`,
  )
  assert.ok(plan.initialDays > 0, `${id}.initialDays must be greater than 0`)

  assert.ok(APP_PLAN_TYPES.has(plan.planType), `${id}.planType must be a value the mobile app understands`)
  assert.equal(plan.isRecurring, plan.planType !== "forever", `${id}.planType must match isRecurring`)
  if (isPlanId(plan.planType) && plan.planType !== id) {
    // apply_hutko_renewal extends by plan_type, so both plans must renew for the same period.
    assert.equal(
      plan.renewalDays,
      PLAN_CONFIG[plan.planType].renewalDays,
      `${id}.renewalDays must match its stored plan_type ${plan.planType}`,
    )
  }
  for (const benefit of plan.masterClassBenefits) {
    requireText(`${id}.masterClassBenefits[]`, benefit)
  }

  if (plan.isRecurring) {
    // No gift months: the first payment opens exactly one renewal period.
    assert.equal(plan.initialDays, plan.renewalDays, `${id}.initialDays must equal renewalDays`)
    assert.ok(plan.renewalAmount !== null, `${id}.renewalAmount must be set for recurring plans`)
    assert.ok(plan.renewalAmount > 0, `${id}.renewalAmount must be greater than 0`)
    assert.ok(plan.renewalDays !== null, `${id}.renewalDays must be set for recurring plans`)
    assert.ok((plan.renewalDays ?? 0) > 0, `${id}.renewalDays must be greater than 0`)
    requireText(`${id}.recurringDescription`, plan.recurringDescription ?? "")
  } else {
    assert.equal(plan.renewalAmount, null, `${id} must not have renewalAmount`)
    assert.equal(plan.renewalDays, null, `${id} must not have renewalDays`)
    assert.equal(plan.recurringDescription, null, `${id} must not have recurringDescription`)
  }
}

assert.deepEqual(
  PURCHASABLE_PLAN_LIST.map((plan) => plan.id),
  PLAN_IDS.filter((id) => isPlanPurchasable(id)),
  "PURCHASABLE_PLAN_LIST must contain exactly the purchasable plans",
)
assert.equal(isPlanPurchasable("month"), false, "month is no longer sold, only renewed")

console.log("✅ lib/plans.ts passed consistency checks")