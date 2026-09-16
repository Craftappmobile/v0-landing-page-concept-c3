import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
