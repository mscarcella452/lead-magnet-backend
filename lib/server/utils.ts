import "server-only";
import crypto from "crypto";
import { prisma } from "@/lib/db";

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
