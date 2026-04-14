// ============================================================================
// CACHE TAGS
// Used with revalidateTag() to invalidate cached data
// ============================================================================

export const CACHE_TAGS = {
  LEADS: "leads",
  DASHBOARD_STATS: "dashboard-stats",
  TEAM_MEMBERS: "team-members",
  USER: "user", // Cache key prefix + global invalidation tag (per-user: getUserCacheTag)
} as const;

// Type for cache tags
export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

// ============================================================================
// CACHE TAG HELPERS
// Type-safe helpers for generating dynamic cache tags
// ============================================================================

/**
 * Generate a user-specific cache tag
 * @param userId - The user's ID
 * @returns Cache tag in format: "user-{userId}"
 */
export function getUserCacheTag(userId: string): string {
  return `${CACHE_TAGS.USER}-${userId}`;
}

// ============================================================================
// REVALIDATE PATHS
// Used with revalidatePath() to invalidate page caches
// ============================================================================

export const REVALIDATE_PATHS = {
  ADMIN_DASHBOARD: "/dashboard",
  ADMIN_LEADS: "/dashboard/leads",
  ADMIN_TEAM: "/admin/team",
} as const;

// Type for paths
export type RevalidatePath =
  (typeof REVALIDATE_PATHS)[keyof typeof REVALIDATE_PATHS];

// ============================================================================
// AUTH ROUTES
// ============================================================================

export const AUTH_ROUTES = {
  LOGIN: "/",
  COMPLETE_INVITE: "/auth/complete-invite",
  ACCOUNT_RECOVERY: "/auth/account-recovery",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  INVALID_TOKEN: "/auth/invalid-token",
} as const;

// ============================================================================
// APP ROUTES
// ============================================================================

export const APP_ROUTES = {
  DASHBOARD: "/dashboard",
  LEADS: "/dashboard/leads",
  TEAM: "/dashboard/team",
  ACCOUNT: "/account",
  ADMIN_TEAM: "/admin/team",
} as const;

// ============================================================================
// Public ROUTES
// Routes that don't require authentication
// ============================================================================

export const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.COMPLETE_INVITE,
  AUTH_ROUTES.ACCOUNT_RECOVERY,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
  AUTH_ROUTES.INVALID_TOKEN,
  "/api/auth",
] as const;

// ============================================================================
// EXPIRY_MS
// ============================================================================

export const EXPIRY_MS = {
  invite: 24 * 60 * 60 * 1000, // Invite links expire after 24 hours
  passwordReset: 60 * 60 * 1000, // Password reset links expire after 1 hour
  emailVerification: 24 * 60 * 60 * 1000, // Email verification links expire after 24 hours
} as const;

// ============================================================================
// ERROR CODES
// Used to identify specific errors in ActionResult responses
// ============================================================================

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  INVITE_EXISTS: "INVITE_EXISTS",
  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
  INVALID_EMAIL: "INVALID_EMAIL",
  FORBIDDEN_ROLE: "FORBIDDEN_ROLE",
} as const;

// ============================================================================
// TYPES
// ============================================================================

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
