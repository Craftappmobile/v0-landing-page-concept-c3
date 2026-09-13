import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  computeExpirationCutoff,
  GRACE_DAYS,
  MAX_BATCH,
  runExpirationSweep,
  type AdminClient,
} from "../lib/expire-subscriptions.ts"

type FakeRow = {
  id: string
  status: string
  expires_at: string
  auto_renewal: boolean
  updated_at?: string
}

/**
 * Minimal in-memory stand-in for the Supabase admin client, supporting only
 * the query/update chain that runExpirationSweep actually uses.
 */
function createFakeSupabase(rows: FakeRow[]) {
  const state = rows.map((row) => ({ ...row }))
  let lastUpdatePayload: Record<string, unknown> | null = null

  const from = (table: string) => {
    assert.equal(table, "subscriptions")
    return {
      select(_columns: string) {
        let filtered = state
        const builder = {
          eq(field: keyof FakeRow, value: unknown) {
            filtered = filtered.filter((row) => row[field] === value)
            return builder
          },
          lt(field: keyof FakeRow, value: string) {
            filtered = filtered.filter((row) => String(row[field]) < value)
            return builder
          },
          order() {
            return builder
          },
          limit(count: number) {
            return Promise.resolve({ data: filtered.slice(0, count), error: null })
          },
        }
        return builder
      },
      update(payload: Record<string, unknown>) {
        lastUpdatePayload = payload
        return {
          in(field: keyof FakeRow, values: string[]) {
            for (const row of state) {
              if (values.includes(row[field] as string)) {
                Object.assign(row, payload)
              }
            }
            return Promise.resolve({ error: null })
          },
        }
      },
    }
  }

  return {
    client: { from } as unknown as AdminClient,
    state,
    getLastUpdatePayload: () => lastUpdatePayload,
  }
}

test("computeExpirationCutoff subtracts the grace period from now", () => {
  const now = new Date("2025-06-10T00:00:00.000Z")
  assert.equal(computeExpirationCutoff(now, 3), "2025-06-07T00:00:00.000Z")
  assert.equal(computeExpirationCutoff(now, 0), now.toISOString())
})

test("runExpirationSweep expires subscriptions older than the grace period and leaves recent ones untouched", async () => {
  const now = new Date("2025-06-10T00:00:00.000Z")
  const { client, state } = createFakeSupabase([
    {
      id: "old-1",
      status: "active",
      expires_at: "2025-06-01T00:00:00.000Z", // 9 days ago -> stale
      auto_renewal: true,
    },
    {
      id: "recent-1",
      status: "active",
      expires_at: "2025-06-09T00:00:00.000Z", // 1 day ago -> within grace period
      auto_renewal: true,
    },
  ])

  const result = await runExpirationSweep(client, now)

  assert.equal(result.ok, true)
  if (result.kind === "expired") {
    assert.equal(result.count, 1)
    assert.equal(result.truncated, false)
  } else {
    assert.fail("expected one subscription to be expired")
  }

  const old = state.find((row) => row.id === "old-1")!
  const recent = state.find((row) => row.id === "recent-1")!

  assert.equal(old.status, "expired")
  assert.equal(recent.status, "active")
})

test("runExpirationSweep never modifies auto_renewal", async () => {
  const now = new Date("2025-06-10T00:00:00.000Z")
  const { client, state, getLastUpdatePayload } = createFakeSupabase([
    {
      id: "old-1",
      status: "active",
      expires_at: "2025-06-01T00:00:00.000Z",
      auto_renewal: true,
    },
  ])

  await runExpirationSweep(client, now)

  const payload = getLastUpdatePayload()
  assert.ok(payload)
  assert.equal("auto_renewal" in (payload as object), false)

  const old = state.find((row) => row.id === "old-1")!
  assert.equal(old.status, "expired")
  assert.equal(old.auto_renewal, true)
})

test("runExpirationSweep reports zero without updating when nothing is stale", async () => {
  const now = new Date("2025-06-10T00:00:00.000Z")
  const { client, state } = createFakeSupabase([
    {
      id: "recent-1",
      status: "active",
      expires_at: "2025-06-09T00:00:00.000Z",
      auto_renewal: true,
    },
  ])

  const result = await runExpirationSweep(client, now)

  assert.deepEqual(result, {
    ok: true,
    kind: "empty",
    count: 0,
    message: "No subscriptions to expire",
  })
  assert.equal(state[0].status, "active")
})

test("default grace period and batch size match the documented cron behavior", () => {
  assert.equal(GRACE_DAYS, 3)
  assert.equal(MAX_BATCH, 500)
})

test("cron route delegates to the shared sweep and enforces CRON_SECRET", () => {
  const source = readFileSync(new URL("../app/api/cron/expire-subscriptions/route.ts", import.meta.url), "utf8")

  assert.equal(source.includes("runExpirationSweep(supabase, new Date())"), true)
  assert.equal(source.includes("Bearer ${cronSecret}"), true)
})
