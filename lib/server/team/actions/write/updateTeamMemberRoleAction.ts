"use server";
import { updateTeamMemberRole } from "@/lib/server/team/write/updateTeamMemberRole";
import { ActionResult } from "@/types/server/actions";
import { User } from "@prisma/client";
import type { AssignableRole } from "@/config/field-controls-config";

/**
 * Server action to update a team member's role
 * Returns ActionResult with updated user or error
 */
export async function updateTeamMemberRoleAction(
  targetUserId: string,
  newRole: AssignableRole,
): Promise<ActionResult<User>> {
  try {
    const user = await updateTeamMemberRole(targetUserId, newRole);
    return { success: true, data: user };
  } catch (error) {
    console.error("Error updating team member role:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update team member role",
    };
  }
}
