import "server-only";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";
import { getCurrentUser } from "@/lib/auth-helpers";
import { ADMIN_ROLES, PROTECTED_ROLES } from "@/lib/auth/constants";

interface EditTeamMemberInput {
  name?: string;
  email?: string;
  role?: UserRole;
}

export async function editTeamMember(
  targetUserId: string,
  data: EditTeamMemberInput,
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  if (!ADMIN_ROLES.includes(currentUser.role.toLowerCase() as never)) {
    throw new Error("Unauthorized");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!targetUser) throw new Error("User not found");

  if (targetUser.role === "OWNER" || targetUser.role === "DEV") {
    throw new Error(`Cannot edit ${targetUser.role} users`);
  }

  if (data.role === "DEV") throw new Error("Cannot change role to DEV");

  if (data.email && data.email !== targetUser.email) {
    const emailTaken = await prisma.user.findFirst({
      where: { email: data.email, id: { not: targetUserId } },
    });
    if (emailTaken) throw new Error("Email already in use");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
    },
  });

  revalidateTag(CACHE_TAGS.TEAM_MEMBERS);
  return updatedUser;
}
