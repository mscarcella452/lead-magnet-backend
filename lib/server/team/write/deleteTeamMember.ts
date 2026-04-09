import "server-only";
import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import { isAdminRole, isProtectedRole } from "@/lib/auth/constants";

export async function deleteTeamMember(targetUserId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");
  if (!isAdminRole(currentUser.role)) throw new Error("Unauthorized");

  if (targetUserId === currentUser.id)
    throw new Error("Cannot delete your own account");

  const userToDelete = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!userToDelete) throw new Error("User not found");

  if (isProtectedRole(userToDelete.role)) {
    throw new Error(`Cannot delete ${userToDelete.role} users`);
  }

  await prisma.user.delete({ where: { id: targetUserId } });
  revalidateTag(CACHE_TAGS.TEAM_MEMBERS, {});
  revalidatePath(REVALIDATE_PATHS.ADMIN_TEAM);
}
