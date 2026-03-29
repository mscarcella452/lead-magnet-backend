"use server";
import {
  inviteTeamMember,
  type InviteTeamMemberInput,
} from "@/lib/server/write/inviteTeamMember";
import { ActionResult } from "@/types/server";

export async function inviteTeamMemberAction(
  data: InviteTeamMemberInput,
): Promise<ActionResult<void>> {
  try {
    await inviteTeamMember(data);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error inviting team member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to invite team member",
    };
  }
}
