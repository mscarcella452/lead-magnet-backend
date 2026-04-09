"use server";
import { deleteTeamMember } from "@/lib/server/team/write/deleteTeamMember";
import { ActionResult } from "@/types/server/actions";

export async function deleteTeamMemberAction(
  targetUserId: string,
): Promise<ActionResult<void>> {
  try {
    await deleteTeamMember(targetUserId);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting team member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete team member",
    };
  }
}
