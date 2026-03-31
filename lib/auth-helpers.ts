import "server-only";
import { auth } from "@/auth";
import { isAdminRole, isProtectedRole } from "@/lib/auth/constants";

export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

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
    role: session.user.role as string,
  };
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
