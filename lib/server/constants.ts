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
  ADMIN_TEAM: "/dashboard/team",
} as const;

// Type for paths
export type RevalidatePath =
  (typeof REVALIDATE_PATHS)[keyof typeof REVALIDATE_PATHS];
