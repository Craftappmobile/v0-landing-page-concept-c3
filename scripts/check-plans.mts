import assert from "node:assert/strict"

import { PLAN_CONFIG, PLAN_IDS, PLAN_LIST } from "../lib/plans.ts"

function priceValueToKopecks(priceValue) {
  const normalized = priceValue.replace(/\s+/g, "")

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
  assert.ok(plan.days > 0, `${id}.days must be greater than 0`)

  if (plan.isRecurring) {
    requireText(`${id}.recurringDescription`, plan.recurringDescription ?? "")
  } else {
    assert.equal(plan.recurringDescription, null, `${id} must not have recurringDescription`)
  }
}

console.log("✅ lib/plans.ts passed consistency checks")