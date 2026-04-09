import "server-only";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";
import { sendInviteEmail } from "@/lib/server/email/send/sendInviteEmail";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import { generateToken, generateUniqueUsername } from "@/lib/server/utils";
import { EXPIRY_MS } from "@/lib/server/constants";
import { ADMIN_ROLES } from "@/lib/auth/constants";
import { isValidEmail } from "@/lib/utils/validation";

// ============================================================
// Types
// ============================================================

export interface InviteTeamMemberInput {
  name: string;
  email: string;
  role: UserRole;
}

// ============================================================
// inviteTeamMember
// ============================================================

export async function inviteTeamMember(
  data: InviteTeamMemberInput,
): Promise<void> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");
  if (!ADMIN_ROLES.includes(currentUser.role as never))
    throw new Error("Unauthorized");

  const { name, email, role } = data;

  if (role === "DEV") throw new Error("Cannot create DEV users from admin UI");
  if (!isValidEmail(email)) throw new Error("Invalid email address");

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) throw new Error("Email already exists");

  const pendingInvite = await prisma.userInvite.findFirst({
    where: {
      user: { email },
      expiresAt: { gt: new Date() },
    },
  });
  if (pendingInvite)
    throw new Error("A pending invite already exists for this email");

  const username = await generateUniqueUsername(name);
  const user = await prisma.user.create({
    data: { name, email, role, username },
  });

  const { token, expiresAt } = generateToken(EXPIRY_MS.invite);
  const invite = await prisma.userInvite.create({
    data: { userId: user.id, token, expiresAt },
  });

  const emailResult = await sendInviteEmail(email, name, token, expiresAt);
  if (!emailResult.success) {
    await prisma.userInvite.delete({ where: { id: invite.id } });
    await prisma.user.delete({ where: { id: user.id } });
    throw new Error(emailResult.error || "Failed to send invite email");
  }

  revalidateTag(CACHE_TAGS.TEAM_MEMBERS, {});
  revalidatePath(REVALIDATE_PATHS.ADMIN_TEAM);
}
