import "server-only";
import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";
import { getCurrentUser } from "@/lib/auth-helpers";

const PROTECTED_ROLES = ["DEV", "OWNER"] as const;

export async function deleteTeamMember(targetUserId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");
  if (targetUserId === currentUser.id)
    throw new Error("Cannot delete your own account");

  const userToDelete = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!userToDelete) throw new Error("User not found");

  if (PROTECTED_ROLES.includes(userToDelete.role as never)) {
    throw new Error(`Cannot delete ${userToDelete.role} users`);
  }

  await prisma.user.delete({ where: { id: targetUserId } });
  revalidateTag(CACHE_TAGS.TEAM_MEMBERS, {});
  revalidatePath(REVALIDATE_PATHS.ADMIN_TEAM);
}
