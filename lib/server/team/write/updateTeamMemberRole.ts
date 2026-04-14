import "server-only";
import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import { isAdminRole, isProtectedRole } from "@/lib/auth/rbac";
import type { AssignableRole } from "@/config/field-controls-config";

/**
 * Update a team member's role (ADMIN only)
 * Only allows assigning ADMIN or MEMBER roles
 * Prevents changing OWNER or DEV roles
 */
export async function updateTeamMemberRole(
  targetUserId: string,
  newRole: AssignableRole,
) {
  // Auth check: current user must be admin
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  if (!isAdminRole(currentUser.role)) {
    throw new Error("Unauthorized");
  }

  // Fetch target user
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Prevent changing protected roles (OWNER, DEV)
  if (isProtectedRole(targetUser.role)) {
    throw new Error(`Cannot change role for ${targetUser.role} users`);
  }

  // Prevent users from changing their own role
  if (targetUserId === currentUser.id) {
    throw new Error("Cannot change your own role");
  }

  // Update the role
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  // Revalidate caches
  revalidateTag(CACHE_TAGS.TEAM_MEMBERS, {});
  revalidatePath(REVALIDATE_PATHS.ADMIN_TEAM);

  return updatedUser;
}
