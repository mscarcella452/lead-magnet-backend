import "server-only";
import { isAdminRole, isProtectedRole } from "@/lib/auth/rbac";
import { getCurrentUser } from "./read/getCurrentUser";

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
