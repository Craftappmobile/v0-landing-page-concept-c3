import assert from "node:assert/strict";
import test from "node:test";

import {
  escapePostgrestLikePattern,
  getCancellationEmailPattern,
  normalizeCancellationEmail,
} from "../lib/cancel-subscription.ts";

test("/api/cancel normalizes submitted email before lookup", () => {
  assert.equal(normalizeCancellationEmail("  User.Name+Premium@Example.COM  "), "user.name+premium@example.com");
  assert.equal(normalizeCancellationEmail("   "), null);
  assert.equal(normalizeCancellationEmail(null), null);
});

test("/api/cancel escapes wildcard characters before case-insensitive email filter", () => {
  assert.equal(escapePostgrestLikePattern("user_name%test@example.com"), "user\\_name\\%test@example.com");
});

test("/api/cancel uses the escaped normalized email as the active subscription lookup pattern", () => {
  assert.equal(getCancellationEmailPattern("user_name%test@example.com"), "user\\_name\\%test@example.com");
});