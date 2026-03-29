import "server-only";
import crypto from "crypto";

// ============================================================
// generateInviteToken
// ============================================================

/**
 * Generates a cryptographically secure invite token and calculates
 * the expiry date based on INVITE_EXPIRY_MS.
 * Use when creating or resending a team member invite.
 */

const INVITE_EXPIRY_MS = 24 * 60 * 60 * 1000; // Invite links expire after 24 hours

export function generateInviteToken() {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
  };
}
