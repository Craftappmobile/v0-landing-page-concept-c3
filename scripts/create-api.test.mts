import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

import * as emailValidation from "../lib/email-validation.ts";
import * as hutko from "../lib/hutko.ts";
import * as plans from "../lib/plans.ts";
import * as recurringMode from "../lib/recurring-mode.ts";

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

test("/api/payment/create validates the email before creating a payment", () => {
  assert.equal(
    createRouteSource.includes('sanitizeEmailInput(typeof email === "string" ? email : "")'),
    true,
  );
  assert.equal(createRouteSource.includes("getEmailValidationError(trimmedEmail)"), true);

  const validationIndex = createRouteSource.indexOf("getEmailValidationError(trimmedEmail)");
  const insertIndex = createRouteSource.indexOf('.from("subscriptions").insert');

  assert.ok(validationIndex > -1, "expected the route to validate the submitted email");
  assert.ok(insertIndex > -1, "expected the route to insert a pending subscription");
  assert.ok(
    validationIndex < insertIndex,
    "email validation must run before the pending subscription insert",
  );

  assert.equal(createRouteSource.includes("{ error: emailError }"), true);
});

test("/api/payment/create returns 400 with the Ukrainian validation message", () => {
  const validationIndex = createRouteSource.indexOf("if (emailError) {");
  assert.ok(validationIndex > -1, "expected an emailError branch in the route");

  const branch = createRouteSource.slice(validationIndex, validationIndex + 200);
  assert.equal(branch.includes("{ error: emailError }"), true);
  assert.equal(branch.includes("status: 400"), true);
});

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

// --- Plan contract: executes the real route with local fixtures; Hutko is a local fake, no network or DB. ---
type Row = Record<string, unknown>;

async function invokeCreate(plan: string, options: { hutkoFails?: boolean } = {}) {
  const inserts: Row[] = [];
  const hutkoRequests: Row[] = [];
  const client = {
    from(table: string) {
      assert.equal(table, "subscriptions");
      return { async insert(values: Row) { inserts.push(values); return { error: null }; } };
    },
  };
  const fakeHutko = async (url: string, init: RequestInit) => {
    assert.equal(url, "https://pay.hutko.org/api/checkout/url/");
    hutkoRequests.push((JSON.parse(String(init.body)) as { request: Row }).request);
    return options.hutkoFails
      ? Response.json({ response: { response_status: "failure", error_code: 1013 } })
      : Response.json({ response: { response_status: "success", checkout_url: "https://pay.hutko.org/merchants/fixture/checkout" } });
  };
  const hutkoModule = {
    ...hutko,
    createHutkoCheckoutUrl: (args: Parameters<typeof hutko.createHutkoCheckoutUrl>[0]) =>
      hutko.createHutkoCheckoutUrl({ ...args, fetchImpl: fakeHutko as typeof fetch }),
  };
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) } },
    "@/lib/supabase": { createAdminClient: () => client },
    "@/lib/hutko": hutkoModule,
    "@/lib/email-validation": emailValidation,
    "@/lib/plans": plans,
    "@/lib/recurring-mode": recurringMode,
  };
  const exports: { POST?: (request: unknown) => Promise<Response> } = {};
  runInNewContext(compiledCreateRoute, {
    exports,
    process: { env: { HUTKO_MERCHANT_ID: "1702587", HUTKO_MERCHANT_PASSWORD: "synthetic-signing-fixture" } },
    console: { log() {}, warn() {}, error() {} },
    require(name: string) { assert.ok(name in modules, `Unexpected import: ${name}`); return modules[name]; },
    Date, Math, JSON, encodeURIComponent,
  });
  assert.ok(exports.POST);
  const response = await exports.POST({
    json: async () => ({ plan, email: "knit@example.com", name: "Оксана" }),
    headers: { get: () => "https://vjazhi.com.ua" },
    nextUrl: { origin: "https://vjazhi.com.ua" },
  });
  return { response, body: await response.json() as Row, inserts, hutkoRequests };
}

test("/api/payment/create rejects month (no longer sold) before any DB write or payment", async () => {
  const result = await invokeCreate("month");
  assert.equal(result.response.status, 400);
  assert.equal(result.inserts.length, 0);
  assert.equal(result.hutkoRequests.length, 0);
});

test("/api/payment/create stores club as plan 'club', plan_type 'year', 249000, without a Hutko button", async () => {
  const result = await invokeCreate("club");
  assert.equal(result.response.status, 200);
  assert.equal(result.inserts.length, 1);
  const row = result.inserts[0];
  assert.equal(row.plan, "club");
  assert.equal(row.plan_type, "year");
  assert.equal(row.amount, 249000);
  assert.equal(row.status, "pending");
  assert.equal(row.auto_renewal, true);
  assert.equal(row.recurring_mode, recurringMode.RECURRING_MODE.MERCHANT_TOKEN);
  assert.equal(result.body.checkout_url, "https://pay.hutko.org/merchants/fixture/checkout");
  assert.equal("hutko_config" in result.body, false);
  const request = result.hutkoRequests[0];
  assert.equal(request.amount, 249000);
  assert.equal(request.required_rectoken, "Y");
  assert.equal(request.merchant_id, 1702587);
  assert.equal(request.server_callback_url, "https://vjazhi.com.ua/api/payment/callback");
  assert.equal(JSON.parse(String(request.merchant_data)).plan, "club");
  assert.ok(String(request.response_url).startsWith("https://vjazhi.com.ua/api/payment/redirect?order_id="));
  assert.equal(typeof request.signature, "string");
});

for (const [plan, amount] of [["quarter", 45400], ["half", 59900], ["year", 91800], ["forever", 549000]] as const) {
  test(`/api/payment/create keeps ${plan} as plan = plan_type and charges ${amount} from code`, async () => {
    const result = await invokeCreate(plan);
    assert.equal(result.response.status, 200);
    assert.equal(result.inserts.length, 1);
    assert.equal(result.inserts[0].plan, plan);
    assert.equal(result.inserts[0].plan_type, plan);
    assert.equal(result.inserts[0].amount, amount);
    assert.equal(result.inserts[0].auto_renewal, plan !== "forever");
    assert.equal(
      result.inserts[0].recurring_mode,
      plan === "forever" ? recurringMode.RECURRING_MODE.NONE : recurringMode.RECURRING_MODE.MERCHANT_TOKEN,
    );
    assert.equal(result.hutkoRequests[0].amount, amount);
    assert.equal("required_rectoken" in result.hutkoRequests[0], plan !== "forever");
    assert.equal("button" in result.hutkoRequests[0], false);
  });
}

test("/api/payment/create answers 502 when Hutko does not return a payment page", async () => {
  const result = await invokeCreate("year", { hutkoFails: true });
  assert.equal(result.response.status, 502);
  assert.equal("checkout_url" in result.body, false);
});
