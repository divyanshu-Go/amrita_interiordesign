// lib/auth/resetToken.js
import crypto from "crypto";

/**
 * createRawToken(bytes)
 * - bytes: number of random bytes (default 32 -> 64 hex chars)
 * - returns raw hex token (string) to send in email links
 */
export function createRawToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * hashToken(rawToken)
 * - uses SHA-256 to hash the raw token
 * - returns hex string suitable for storing in DB
 */
export function hashToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") {
    throw new Error("rawToken must be a non-empty string");
  }
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
