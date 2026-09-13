// Email input helpers for the checkout flow.
//
// Shoppers often mistype their email when paying: a missing dot, a comma
// instead of a dot, a typo in a popular domain, or stray spaces from
// copy-paste. The subscription is activated on the email they type in, so a
// bad address means the confirmation email and app access never arrive.
// These helpers sanitize the value as it is typed, return a specific
// human-readable validation message, and suggest a one-click fix for the
// most common typos.

const EMAIL_LOCAL_PART_PATTERN = /^[A-Za-z0-9._%+-]+$/
const EMAIL_DOMAIN_CHARS_PATTERN = /^[A-Za-z0-9.-]+$/
const EMAIL_TLD_PATTERN = /^[A-Za-z]{2,}$/

// Removes every whitespace character (including NBSP) plus zero-width
// characters that often come from copy-paste. Email addresses can never
// contain spaces.
export function sanitizeEmailInput(value: string): string {
  return value.replace(/[\s\u200B\u200C\u200D\uFEFF]+/g, "")
}

// Returns null for a syntactically valid email, or a specific Ukrainian
// message describing what exactly looks wrong.
export function getEmailValidationError(rawEmail: string): string | null {
  const email = sanitizeEmailInput(rawEmail)

  if (!email) return "Вкажіть email"

  if (!email.includes("@")) return "В email немає знака «@» — наприклад, name@gmail.com"

  if (email.includes(",")) return "Схоже, ви ввели кому «,» замість крапки — наприклад, name@gmail.com"

  const atCount = email.split("@").length - 1
  if (atCount > 1) return "Email може містити лише один знак «@»"

  const at = email.indexOf("@")
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)

  if (!local) return "Перед «@» не вказано ім'я — наприклад, name@gmail.com"

  if (!domain) return "Після «@» не вказано домен — наприклад, name@gmail.com"

  if (domain.startsWith(".") || domain.startsWith("-")) {
    return "Домен не може починатись з крапки — наприклад, name@gmail.com"
  }

  if (domain.endsWith(".") || domain.endsWith("-")) {
    return "Домен не може закінчуватись крапкою — перевірте адресу"
  }

  if (domain.includes("..")) return "У домені дві крапки поспіль — наприклад, name@gmail.com"

  if (!domain.includes(".")) {
    return `Схоже, ви пропустили крапку в домені — наприклад, ${local}@gmail.com`
  }

  const tld = domain.slice(domain.lastIndexOf(".") + 1)
  if (!EMAIL_TLD_PATTERN.test(tld)) {
    return "Домен має закінчуватись на доменну зону — наприклад, .com, .ua, .net"
  }

  if (!EMAIL_LOCAL_PART_PATTERN.test(local)) {
    return "Ім'я перед «@» містить недопустимі символи"
  }

  if (!EMAIL_DOMAIN_CHARS_PATTERN.test(domain)) {
    return "Домен містить недопустимі символи"
  }

  return null
}

export function isValidEmailFormat(rawEmail: string): boolean {
  return getEmailValidationError(rawEmail) === null
}

// Popular providers whose domain users most often leave without a dot.
const DOTLESS_DOMAIN_FIXES: Record<string, string> = {
  gmail: "gmail.com",
  gmailcom: "gmail.com",
  ukr: "ukr.net",
  ukrnet: "ukr.net",
  meta: "meta.ua",
  metaua: "meta.ua",
  icloud: "icloud.com",
  icloudcom: "icloud.com",
  outlook: "outlook.com",
  outlookcom: "outlook.com",
  hotmail: "hotmail.com",
  hotmailcom: "hotmail.com",
  yahoo: "yahoo.com",
  yahoocom: "yahoo.com",
}

// Known misspellings of popular domains. Syntactically some of them look
// valid (e.g. "gmail.con"), but mail to such addresses never arrives.
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.ru": "gmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.con": "icloud.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "ukr.nt": "ukr.net",
  "ukr.ne": "ukr.net",
}

// Returns a corrected version of the email for the most common typos, or
// null when there is nothing safe to suggest. A fix is returned only if it
// fully passes validation, so the UI can apply it in one click.
export function suggestEmailFix(rawEmail: string): string | null {
  const email = sanitizeEmailInput(rawEmail)

  const at = email.indexOf("@")
  if (at < 0 || email.indexOf("@", at + 1) >= 0) return null

  const local = email.slice(0, at)
  let domain = email.slice(at + 1).toLowerCase()

  domain = domain.replace(/,/g, ".")
  domain = domain.replace(/\.{2,}/g, ".")
  domain = domain.replace(/^[-.]+|[-.]+$/g, "")

  if (!domain.includes(".")) {
    const dotlessFix = DOTLESS_DOMAIN_FIXES[domain]
    if (dotlessFix) domain = dotlessFix
  }

  const typoFix = DOMAIN_TYPOS[domain]
  if (typoFix) domain = typoFix

  const fixedEmail = `${local}@${domain}`
  if (fixedEmail === email) return null
  if (getEmailValidationError(fixedEmail) !== null) return null

  return fixedEmail
}
