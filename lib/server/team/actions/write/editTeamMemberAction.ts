"use server";
import { editTeamMember } from "@/lib/server/team/write/editTeamMember";
import { ActionResult } from "@/types/server/actions";
import { User, UserRole } from "@prisma/client";

export async function editTeamMemberAction(
  targetUserId: string,
  data: { name?: string; email?: string; role?: UserRole },
): Promise<ActionResult<User>> {
  try {
    const user = await editTeamMember(targetUserId, data);
    return { success: true, data: user };
  } catch (error) {
    console.error("Error editing team member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to edit team member",
    };
  }
}
