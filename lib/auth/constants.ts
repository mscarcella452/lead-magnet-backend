import { UserRole } from "@prisma/client";

/**
 * Role-based access control constants
 * Tied directly to the UserRole enum in Prisma schema
 */

// Roles that can access admin features (team management, etc.)
export const ADMIN_ROLES = [
  UserRole.OWNER,
  UserRole.ADMIN,
  UserRole.DEV,
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// Roles that cannot be edited or deleted
export const PROTECTED_ROLES = [UserRole.OWNER, UserRole.DEV] as const;
export type ProtectedRole = (typeof PROTECTED_ROLES)[number];

/**
 * Safely parse an unknown value into a UserRole, or return undefined
 */
function toUserRole(role: unknown): UserRole | undefined {
  if (
    typeof role === "string" &&
    Object.values(UserRole).includes(role as UserRole)
  ) {
    return role as UserRole;
  }
  return undefined;
}

/**
 * Check if a role has admin access
 */
export function isAdminRole(role: unknown): boolean {
  const parsed = toUserRole(role);
  if (!parsed) return false;
  return (ADMIN_ROLES as readonly UserRole[]).includes(parsed);
}

/**
 * Check if a role is protected from deletion/editing
 */
export function isProtectedRole(role: unknown): boolean {
  const parsed = toUserRole(role);
  if (!parsed) return false;
  return (PROTECTED_ROLES as readonly UserRole[]).includes(parsed);
}
