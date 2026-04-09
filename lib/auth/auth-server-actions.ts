import "server-only";
import { auth } from "@/auth";
import { isAdminRole, isProtectedRole } from "@/lib/auth/constants";
import { prisma } from "@/lib/db";
import { Prisma, UserRole } from "@prisma/client";

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

/**
 * Get the current authenticated user from the database (fresh data)
 * Use this for:
 * - Displaying user profile data
 * - Pages that need accurate, up-to-date user info
 * - After mutations that update user data
 */
export async function getCurrentUserFromDB(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, username: true, email: true, role: true },
  });
}

/**
 * Check if the current user has admin access
 * Admin roles: owner, admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return isAdminRole(user?.role);
}

/**
 * Check if the current user's role is protected
 * Protected roles: owner
 */
export async function isCurrentUserProtected(): Promise<boolean> {
  const user = await getCurrentUser();
  return isProtectedRole(user?.role);
}
