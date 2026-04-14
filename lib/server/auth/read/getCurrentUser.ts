import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Prisma, UserRole } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, getUserCacheTag } from "@/lib/server/constants";

// ============================================================================
// Types
// ============================================================================

// Derive CurrentUser type from Prisma's User model
export type CurrentUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    username: true;
    email: true;
    role: true;
  };
}>;

// ============================================================================
// Session-based user (fast, no DB hit)
// ============================================================================

/**
 * Get the current authenticated user from the session
 * Use this in server components and server actions to get user context
 * for activity logging and authorization checks
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id as string,
    name: session.user.name || "",
    username: session.user.username as string,
    email: session.user.email || "",
    role: session.user.role as UserRole,
  };
}

// ============================================================================
// Database-based user (fresh data, cached for 60s)
// ============================================================================

/**
 * Fetch user from database by ID
 * Internal function - use getCachedUserById export instead
 */
async function fetchUserById(userId: string): Promise<CurrentUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, username: true, email: true, role: true },
  });
}

/**
 * Cached user lookup by ID
 * Cache revalidates every 60 seconds or when invalidated via tags:
 * - getUserCacheTag(userId): Invalidate specific user
 * - CACHE_TAGS.USER: Invalidate ALL users (nuclear option)
 */
const getCachedUserById = (userId: string) =>
  unstable_cache(
    () => fetchUserById(userId),
    [CACHE_TAGS.USER, userId],
    { revalidate: 60, tags: [getUserCacheTag(userId), CACHE_TAGS.USER] }
  )();

/**
 * Get the current authenticated user from the database (cached for 60s)
 * Use this for:
 * - Admin authorization checks (prevents stale session role attacks)
 * - Displaying user profile data
 * - Pages that need accurate, up-to-date user info
 */
export async function getCurrentUserFromDB(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return getCachedUserById(session.user.id);
}
