"use server";
import { resendTeamMemberInvite } from "@/lib/server/write/resendTeamMemberInvite";
import { ActionResult } from "@/types/server";

export async function resendTeamMemberInviteAction(
  targetUserId: string,
): Promise<ActionResult<void>> {
  try {
    await resendTeamMemberInvite(targetUserId);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error resending team member invite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resend invite",
    };
  }
}
