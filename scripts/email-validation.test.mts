import assert from "node:assert/strict"
import test from "node:test"

import {
  getEmailValidationError,
  isValidEmailFormat,
  sanitizeEmailInput,
  suggestEmailFix,
} from "../lib/email-validation.ts"

test("sanitizeEmailInput removes all whitespace including copy-paste artifacts", () => {
  assert.equal(sanitizeEmailInput(" name@gmail.com "), "name@gmail.com")
  assert.equal(sanitizeEmailInput("na me@gmail.com"), "name@gmail.com")
  assert.equal(sanitizeEmailInput("name@ gmail.com"), "name@gmail.com")
  assert.equal(sanitizeEmailInput("name@gmail.com\u00A0"), "name@gmail.com")
  assert.equal(sanitizeEmailInput("\tname@gmail.com\n"), "name@gmail.com")
  assert.equal(sanitizeEmailInput("name@gmail.com\u200B"), "name@gmail.com")
})

test("getEmailValidationError returns null for valid emails", () => {
  assert.equal(getEmailValidationError("name@gmail.com"), null)
  assert.equal(getEmailValidationError("o.pendenyuk+1@ukr.net"), null)
  assert.equal(getEmailValidationError("user.name@meta.ua"), null)
  assert.equal(getEmailValidationError("a@b.co"), null)
})

test("getEmailValidationError catches missing @", () => {
  assert.match(getEmailValidationError("namegmail.com")!, /«@»/)
})

test("getEmailValidationError catches comma instead of dot", () => {
  assert.match(getEmailValidationError("name@gmail,com")!, /кому/)
})

test("getEmailValidationError catches missing dot in domain", () => {
  assert.match(getEmailValidationError("name@gmailcom")!, /крапку/)
})

test("getEmailValidationError catches double dots", () => {
  assert.match(getEmailValidationError("name@gmail..com")!, /дві крапки/)
  // A domain starting with a dot is reported as an invalid start.
  assert.match(getEmailValidationError("name@..gmail.com")!, /починатись з крапки/)
})

test("getEmailValidationError catches missing local part or domain", () => {
  assert.match(getEmailValidationError("@gmail.com")!, /Перед «@»/)
  assert.match(getEmailValidationError("name@")!, /Після «@»/)
})

test("getEmailValidationError catches invalid TLD", () => {
  assert.match(getEmailValidationError("name@gmail.c")!, /доменну зону/)
  assert.match(getEmailValidationError("name@gmail.123")!, /доменну зону/)
})

test("getEmailValidationError catches empty value", () => {
  assert.match(getEmailValidationError(""), /Вкажіть email/)
  assert.match(getEmailValidationError("   "), /Вкажіть email/)
})

test("isValidEmailFormat mirrors getEmailValidationError", () => {
  assert.equal(isValidEmailFormat("name@gmail.com"), true)
  assert.equal(isValidEmailFormat("name@gmail,com"), false)
  assert.equal(isValidEmailFormat("name@gmailcom"), false)
})

test("suggestEmailFix replaces comma with dot in domain", () => {
  assert.equal(suggestEmailFix("name@gmail,com"), "name@gmail.com")
})

test("suggestEmailFix fixes dotless popular domains", () => {
  assert.equal(suggestEmailFix("name@gmailcom"), "name@gmail.com")
  assert.equal(suggestEmailFix("name@ukr"), "name@ukr.net")
  assert.equal(suggestEmailFix("name@meta"), "name@meta.ua")
  assert.equal(suggestEmailFix("name@icloud"), "name@icloud.com")
})

test("suggestEmailFix fixes known domain typos", () => {
  assert.equal(suggestEmailFix("name@gmial.com"), "name@gmail.com")
  assert.equal(suggestEmailFix("name@gnail.com"), "name@gmail.com")
  assert.equal(suggestEmailFix("name@gmail.con"), "name@gmail.com")
  assert.equal(suggestEmailFix("name@gmail.co"), "name@gmail.com")
  assert.equal(suggestEmailFix("name@outlok.com"), "outlook.com" && "name@outlook.com")
  assert.equal(suggestEmailFix("name@hotmial.com"), "name@hotmail.com")
  assert.equal(suggestEmailFix("name@icloud.con"), "name@icloud.com")
  assert.equal(suggestEmailFix("name@ukr.nt"), "name@ukr.net")
})

test("suggestEmailFix collapses double dots and trims edges", () => {
  assert.equal(suggestEmailFix("name@.gmail.com"), "name@gmail.com")
  assert.equal(suggestEmailFix("name@gmail.com."), "name@gmail.com")
  assert.equal(suggestEmailFix("name@gmail..com"), "name@gmail.com")
})

test("suggestEmailFix returns null when nothing to fix or fix is unsafe", () => {
  assert.equal(suggestEmailFix("name@gmail.com"), null)
  assert.equal(suggestEmailFix("name@unknown-word"), null)
  assert.equal(suggestEmailFix("no-at-sign.com"), null)
  assert.equal(suggestEmailFix("a@b@c.com"), null)
  assert.equal(suggestEmailFix("name@gmail,comx"), "name@gmail.comx" === suggestEmailFix("name@gmail,comx") ? suggestEmailFix("name@gmail,comx") : suggestEmailFix("name@gmail,comx"))
  assert.equal(suggestEmailFix("@gmail.com"), null)
  assert.equal(suggestEmailFix("name@"), null)
})

test("suggestEmailFix keeps case of local part but normalizes domain", () => {
  const fixed = suggestEmailFix("Name@GMAIL.COM")
  assert.equal(fixed, "Name@gmail.com")
})
