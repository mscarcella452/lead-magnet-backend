import "server-only";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";
import { sendInviteEmail } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth-helpers";
import { generateInviteToken } from "@/lib/server/utils";

// ============================================================
// constants
// ============================================================

const ALLOWED_ROLES = ["ADMIN", "OWNER"] as const;

// ============================================================
// resendTeamMemberInvite
// ============================================================

export async function resendTeamMemberInvite(targetUserId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");
  if (!ALLOWED_ROLES.includes(currentUser.role as never))
    throw new Error("Unauthorized");

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!targetUser) throw new Error("User not found");
  if (targetUser.password) throw new Error("User already has a password set");
  if (!targetUser.email) throw new Error("User has no email address");

  await prisma.userInvite.deleteMany({ where: { userId: targetUserId } });

  const { token, expiresAt } = generateInviteToken();
  const invite = await prisma.userInvite.create({
    data: { userId: targetUserId, token, expiresAt },
  });

  try {
    await sendInviteEmail(
      targetUser.email,
      targetUser.name ?? targetUser.email,
      token,
    );
  } catch {
    await prisma.userInvite.delete({ where: { id: invite.id } });
    throw new Error("Failed to send invite email");
  }

  revalidateTag(CACHE_TAGS.TEAM_MEMBERS);
}
