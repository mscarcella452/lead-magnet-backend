import "server-only";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import { isAdminRole, isProtectedRole } from "@/lib/auth/constants";
import { isValidEmail } from "@/lib/utils/validation";

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

  if (!isAdminRole(currentUser.role)) {
    throw new Error("Unauthorized");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!targetUser) throw new Error("User not found");

  if (isProtectedRole(targetUser.role)) {
    throw new Error(`Cannot edit ${targetUser.role} users`);
  }

  if (data.role && isProtectedRole(data.role)) {
    throw new Error(`Cannot change role to ${data.role}`);
  }

  if (data.email !== undefined && data.email !== targetUser.email) {
    if (!isValidEmail(data.email)) throw new Error("Invalid email address");
    const emailTaken = await prisma.user.findFirst({
      where: { email: data.email, id: { not: targetUserId } },
    });
    if (emailTaken) throw new Error("Email already in use");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.role !== undefined && { role: data.role }),
    },
  });

  revalidateTag(CACHE_TAGS.TEAM_MEMBERS, {});
  revalidatePath(REVALIDATE_PATHS.ADMIN_TEAM);
  return updatedUser;
}
