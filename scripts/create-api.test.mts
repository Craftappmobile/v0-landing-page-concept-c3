import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

import * as plans from "../lib/plans.ts";

import {
  getEmailValidationError,
  isValidEmailFormat,
  sanitizeEmailInput,
  suggestEmailFix,
} from "../lib/email-validation.ts";
import { resolveDirectPaymentAccessEmail } from "../lib/payment-flow.ts";

const createRouteSource = readFileSync(
  new URL("../app/api/payment/create/route.ts", import.meta.url),
  "utf8",
);
const callbackRouteSource = readFileSync(
  new URL("../app/api/payment/callback/route.ts", import.meta.url),
  "utf8",
);
const compiledCreateRoute = ts.transpileModule(createRouteSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

test("the production incident case (space instead of @) is rejected before payment", () => {
  const typed = "ryabkinaoksana1975 gmail.com";

  assert.equal(sanitizeEmailInput(typed), "ryabkinaoksana1975gmail.com");
  assert.equal(
    getEmailValidationError(sanitizeEmailInput(typed)),
    "В email немає знака «@» — наприклад, name@gmail.com",
  );
});

test("copy-paste whitespace and zero-width characters are stripped before validation", () => {
  assert.equal(sanitizeEmailInput(" oksana@gmail.com\u00A0"), "oksana@gmail.com");
  assert.equal(sanitizeEmailInput("oksana@\u200Bgmail.com"), "oksana@gmail.com");
  assert.equal(getEmailValidationError(sanitizeEmailInput("oksana@gmail.com\uFEFF")), null);
});

test("valid customer emails are not blocked by the new validation", () => {
  const accepted = [
    "ryabkinaoksana1975@gmail.com",
    "user.name+premium@example.com",
    "oksana@ukr.net",
    "a@icloud.com",
  ];

  for (const email of accepted) {
    assert.equal(isValidEmailFormat(sanitizeEmailInput(email)), true, `${email} should be accepted`);
  }
});

test("common typos stay rejected so a broken address never starts a payment", () => {
  const rejected = [
    "oksana@gmail,com",
    "oksana@gmail",
    "oksana@gmail..com",
    "oksana@.com",
  ];

  for (const email of rejected) {
    assert.notEqual(getEmailValidationError(sanitizeEmailInput(email)), null, `${email} should be rejected`);
  }

  // A mistyped TLD is syntactically valid, so it is offered as a one-click fix
  // in the checkout form rather than blocked as an error.
  assert.equal(suggestEmailFix("oksana@gmail.con"), "oksana@gmail.com");
});

test("a malformed direct-payment access email survives normalization and fails validation", () => {
  const malformed = "ryabkinaoksana1975 gmail.com";
  const accessEmail = resolveDirectPaymentAccessEmail({ accessEmail: malformed });

  assert.equal(accessEmail, malformed);
  assert.equal(isValidEmailFormat(accessEmail), false);
  assert.equal(resolveDirectPaymentAccessEmail({ accessEmail: "  " }), "");
});

test("/api/payment/callback never provisions access on a malformed email", () => {
  const guardIndex = callbackRouteSource.indexOf("!isValidEmailFormat(args.customerEmail)");
  const createUserIndex = callbackRouteSource.indexOf("supabase.auth.admin.createUser");

  assert.ok(guardIndex > -1, "expected a malformed-email guard in provisionCustomerAccess");
  assert.ok(createUserIndex > -1, "expected Auth user creation in the callback");
  assert.ok(
    guardIndex < createUserIndex,
    "the malformed-email guard must run before Auth user creation",
  );
  assert.equal(callbackRouteSource.includes('email_status: "no_email_found"'), true);
});

test("/api/payment/callback sends direct payments with a malformed access email to manual review", () => {
  assert.equal(callbackRouteSource.includes("getEmailValidationError(directAccessEmail)"), true);
  assert.equal(
    callbackRouteSource.includes('directAccessEmail ? "invalid_access_email" : "missing_access_email"'),
    true,
  );
  assert.equal(callbackRouteSource.includes('status: "manual_review", reason'), true);
});

// --- Since 30.10.2026 the route never starts a payment: packages are paid on yarnmk.com.ua. ---
async function invokeCreate(plan: unknown) {
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) } },
    "@/lib/plans": plans,
  };
  const exports: { POST?: (request: unknown) => Promise<Response> } = {};
  runInNewContext(compiledCreateRoute, {
    exports,
    process: { env: {} },
    console: { log() {}, warn() {}, error() {} },
    require(name: string) { assert.ok(name in modules, `Unexpected import: ${name}`); return modules[name]; },
    fetch: () => { throw new Error("Network is forbidden in create tests"); },
    URL, JSON,
  });
  assert.ok(exports.POST);
  const response = await exports.POST({ json: async () => ({ plan, email: "knit@example.com", name: "Оксана" }) });
  return { response, body: await response.json() as Record<string, unknown> };
}

for (const plan of ["quarter", "half", "year", "club", "forever"] as const) {
  test(`/api/payment/create sends ${plan} to the yarnmk.com.ua checkout (410, no payment)`, async () => {
    const result = await invokeCreate(plan);
    assert.equal(result.response.status, 410);
    assert.equal("hutko_config" in result.body, false);
    const url = new URL(String(result.body.checkout_url));
    assert.equal(url.origin + url.pathname, "https://yarnmk.com.ua/oplata/pidpyska");
    assert.equal(url.searchParams.get("plan"), plan);
  });
}

test("/api/payment/create: month (off sale) also goes to the checkout, without a plan", async () => {
  const result = await invokeCreate("month");
  assert.equal(result.response.status, 410);
  assert.equal(new URL(String(result.body.checkout_url)).searchParams.has("plan"), false);
});

test("/api/payment/create rejects unknown plans", async () => {
  for (const plan of ["nope", "constructor", 42, null]) {
    assert.equal((await invokeCreate(plan)).response.status, 400);
  }
});

test("/api/payment/create no longer touches the database or Hutko", () => {
  assert.equal(createRouteSource.includes("createAdminClient"), false);
  assert.equal(createRouteSource.includes("hutko"), false);
});
