"use server";
import {
  inviteTeamMember,
  type InviteTeamMemberInput,
} from "@/lib/server/team/write/inviteTeamMember";
import { ActionResult } from "@/types/server/actions";
import { getErrorCode } from "@/lib/server/utils";

export async function inviteTeamMemberAction(
  data: InviteTeamMemberInput,
): Promise<ActionResult<void>> {
  try {
    await inviteTeamMember(data);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error inviting team member:", error);
    const message =
      error instanceof Error ? error.message : "Failed to invite team member";
    const code = getErrorCode(message);
    return {
      success: false,
      error: message,
      code,
    };
  }
}
