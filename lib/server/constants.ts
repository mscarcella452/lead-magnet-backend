// ============================================================================
// CACHE TAGS
// Used with revalidateTag() to invalidate cached data
// ============================================================================

export const CACHE_TAGS = {
  LEADS: "leads",
  LEAD_NOTES: "lead-notes",
  DASHBOARD_STATS: "dashboard-stats",
  TEAM_MEMBERS: "team-members",
} as const;

// Type for cache tags
export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

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
// REDIRECT HELPERS
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

// ============================================================================
// EXPIRY_MS
// ============================================================================

export const EXPIRY_MS = {
  invite: 24 * 60 * 60 * 1000, // Invite links expire after 24 hours
  passwordReset: 60 * 60 * 1000, // Password reset links expire after 1 hour
  emailVerification: 24 * 60 * 60 * 1000, // Email verification links expire after 24 hours
} as const;

// ============================================================================
// TYPES
// ============================================================================

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
