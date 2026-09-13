import assert from "node:assert/strict"
import test from "node:test"

import { normalizeEmail, selectRetryAudience, type CandidateRow } from "../lib/retry-payment-emails.ts"

const NOW = new Date("2026-09-13T00:00:00.000Z")

function row(overrides: Partial<CandidateRow>): CandidateRow {
  return {
    id: "id-1",
    email: "user@example.com",
    customer_name: "User",
    plan: null,
    plan_type: "year",
    status: "expired",
    expires_at: "2026-08-01T00:00:00.000Z",
    renewal_retry_email_sent_at: null,
    updated_at: "2026-08-01T00:00:00.000Z",
    created_at: "2026-08-01T00:00:00.000Z",
    ...overrides,
  }
}

test("selectRetryAudience includes expired/failed rows without a live active subscription", () => {
  const audience = selectRetryAudience([row({ id: "a", email: "a@example.com", status: "expired" })], NOW)
  assert.equal(audience.length, 1)
  assert.equal(audience[0].email, "a@example.com")
  assert.equal(audience[0].planId, "year")
})

test("selectRetryAudience excludes pending subscriptions entirely", () => {
  const audience = selectRetryAudience(
    [row({ id: "p", email: "pending@example.com", status: "pending" })],
    NOW,
  )
  assert.equal(audience.length, 0)
})

test("selectRetryAudience excludes emails that already have a live active subscription", () => {
  const audience = selectRetryAudience(
    [
      row({ id: "old", email: "renewed@example.com", status: "expired", expires_at: "2026-01-01T00:00:00.000Z" }),
      row({
        id: "new",
        email: "renewed@example.com",
        status: "active",
        expires_at: "2027-01-01T00:00:00.000Z",
      }),
    ],
    NOW,
  )
  assert.equal(audience.length, 0)
})

test("selectRetryAudience picks the most recently updated eligible row per email", () => {
  const audience = selectRetryAudience(
    [
      row({
        id: "older",
        email: "dup@example.com",
        plan_type: "quarter",
        updated_at: "2026-05-01T00:00:00.000Z",
      }),
      row({
        id: "newer",
        email: "dup@example.com",
        plan_type: "half",
        updated_at: "2026-08-01T00:00:00.000Z",
      }),
    ],
    NOW,
  )
  assert.equal(audience.length, 1)
  assert.equal(audience[0].id, "newer")
  assert.equal(audience[0].planId, "half")
})

test("selectRetryAudience skips emails whose latest eligible row already has the email marker set", () => {
  const audience = selectRetryAudience(
    [row({ id: "already-sent", email: "sent@example.com", renewal_retry_email_sent_at: "2026-09-01T00:00:00.000Z" })],
    NOW,
  )
  assert.equal(audience.length, 0)
})

test("selectRetryAudience falls back to the legacy plan column, then to the default plan id", () => {
  const fallbackToPlan = selectRetryAudience(
    [row({ id: "legacy", email: "legacy@example.com", plan_type: null, plan: "forever" })],
    NOW,
  )
  assert.equal(fallbackToPlan[0].planId, "forever")

  const fallbackToDefault = selectRetryAudience(
    [row({ id: "unknown-plan", email: "unknown@example.com", plan_type: "not-a-plan", plan: null })],
    NOW,
  )
  assert.equal(fallbackToDefault[0].planId, "year")
})

test("normalizeEmail trims and lowercases, treating blank as absent", () => {
  assert.equal(normalizeEmail("  User@Example.com "), "user@example.com")
  assert.equal(normalizeEmail("   "), null)
  assert.equal(normalizeEmail(null), null)
})
