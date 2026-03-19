import crypto from "crypto";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SPECIAL = "!@#$%^&*";
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;

/**
 * Generate a cryptographically secure 12-character password.
 * Guarantees at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.
 */
export function generateSecurePassword(): string {
  const length = 12;

  // Ensure at least one character from each required set
  const required = [
    pickRandom(UPPERCASE),
    pickRandom(LOWERCASE),
    pickRandom(DIGITS),
    pickRandom(SPECIAL),
  ];

  // Fill remaining positions with random characters from the full set
  const remaining: string[] = [];
  for (let i = 0; i < length - required.length; i++) {
    remaining.push(pickRandom(ALL_CHARS));
  }

  // Combine and shuffle using Fisher-Yates with crypto randomness
  const chars = [...required, ...remaining];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

/** Pick a random character from a string using crypto.randomBytes */
function pickRandom(charset: string): string {
  return charset[cryptoRandomInt(charset.length)];
}

/** Generate a cryptographically secure random integer in [0, max) */
function cryptoRandomInt(max: number): number {
  const bytes = crypto.randomBytes(4);
  const value = bytes.readUInt32BE(0);
  return value % max;
}

