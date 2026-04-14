import "server-only";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { ERROR_CODES, type ErrorCode } from "./constants";

// ============================================================================
// generateToken
// ============================================================================
/**
 * Generates a cryptographically secure token and calculates the expiry
 * date based on the provided expiryMs. Use EXPIRY_MS constants to keep
 * expiry times consistent across all email flows.
 * Use when creating any email-based token (invite, password reset, etc).
 */

export function generateToken(expiryMs: number) {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + expiryMs),
  };
}

// ============================================================================
// generateUniqueUsername
// ============================================================================
/**
 * Generates a unique username from a display name by appending a random
 * hex suffix (e.g. "john.doe.3f9a1b2c"). Retries until no collision is
 * found in the database.
 * Use when creating a new user account.
 */

export async function generateUniqueUsername(name: string): Promise<string> {
  const base = name.toLowerCase().replace(/\s+/g, ".");
  while (true) {
    const suffix = crypto.randomBytes(4).toString("hex");
    const username = `${base}.${suffix}`.toLowerCase(); // Ensure lowercase
    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) return username;
  }
}

// ============================================================================
// getErrorCode
// ============================================================================
/**
 * Maps error messages to error codes for consistent error handling in the UI.
 * Returns undefined if the error message doesn't match any known error.
 * Use in server actions to add error codes to ActionResult responses.
 */

const ERROR_MESSAGE_MAP: Record<string, ErrorCode> = {
  "Email already exists": ERROR_CODES.EMAIL_EXISTS,
  "A pending invite already exists for this email": ERROR_CODES.INVITE_EXISTS,
  Unauthorized: ERROR_CODES.UNAUTHORIZED,
  "Failed to send invite email": ERROR_CODES.EMAIL_SEND_FAILED,
  "Invalid email address": ERROR_CODES.INVALID_EMAIL,
  "Cannot create DEV users from admin UI": ERROR_CODES.FORBIDDEN_ROLE,
};

export const getErrorCode = (message: string): ErrorCode | undefined =>
  ERROR_MESSAGE_MAP[message];
