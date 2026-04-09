import "server-only";
import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";
import { sendInviteEmail } from "@/lib/server/email/send/sendInviteEmail";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import { generateToken } from "@/lib/server/utils";
import { EXPIRY_MS } from "@/lib/server/constants";
import { ADMIN_ROLES } from "@/lib/auth/constants";

// ============================================================
// resendTeamMemberInvite
// ============================================================

export async function resendTeamMemberInvite(targetUserId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");
  if (!ADMIN_ROLES.includes(currentUser.role.toLowerCase() as never))
    throw new Error("Unauthorized");

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!targetUser) throw new Error("User not found");
  if (targetUser.password) throw new Error("User already has a password set");
  if (!targetUser.email) throw new Error("User has no email address");

  await prisma.userInvite.deleteMany({ where: { userId: targetUserId } });

  const { token, expiresAt } = generateToken(EXPIRY_MS.invite);
  const invite = await prisma.userInvite.create({
    data: { userId: targetUserId, token, expiresAt },
  });

  const emailResult = await sendInviteEmail(
    targetUser.email,
    targetUser.name ?? targetUser.email,
    token,
    expiresAt,
  );
  if (!emailResult.success) {
    await prisma.userInvite.delete({ where: { id: invite.id } });
    throw new Error(emailResult.error || "Failed to send invite email");
  }

  revalidateTag(CACHE_TAGS.TEAM_MEMBERS, {});
  revalidatePath(REVALIDATE_PATHS.ADMIN_TEAM);
}
