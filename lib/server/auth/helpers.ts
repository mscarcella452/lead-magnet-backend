import "server-only";
import type { TokenType, TokenReason } from "@/types/auth";
import { AUTH_ROUTES, APP_ROUTES } from "@/lib/server/constants";

// ============================================================================
// URL Builders
// ============================================================================

/** Build account URL with optional query params */
export const buildAccountUrl = (params?: { emailVerified?: boolean }) => {
  if (!params?.emailVerified) return APP_ROUTES.ACCOUNT;
  return `${APP_ROUTES.ACCOUNT}?emailVerified=true`;
};

/** Build verify-email URL with token */
export const buildVerifyEmailUrl = (token: string) => {
  return `${AUTH_ROUTES.VERIFY_EMAIL}?token=${token}`;
};

/** Build complete-invite URL with token */
export const buildCompleteInviteUrl = (token: string) => {
  return `${AUTH_ROUTES.COMPLETE_INVITE}?token=${token}`;
};

/** Build reset-password URL with token */
export const buildResetPasswordUrl = (token: string) => {
  return `${AUTH_ROUTES.RESET_PASSWORD}?token=${token}`;
};

/** Build invalid-token URL with reason and type */
export const buildInvalidTokenUrl = (params: {
  reason: TokenReason;
  type: TokenType;
}) => {
  return `${AUTH_ROUTES.INVALID_TOKEN}?reason=${params.reason}&type=${params.type}`;
};
