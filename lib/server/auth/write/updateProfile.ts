import "server-only";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { revalidateTag } from "next/cache";
import { getUserCacheTag } from "@/lib/server/constants";

interface UpdateProfileInput {
  name: string;
  username: string;
}

export async function updateProfile(data: UpdateProfileInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("unauthorized");

  // Normalize username to lowercase for case-insensitive storage
  const normalizedUsername = data.username.toLowerCase().trim();

  // Check if username is taken by another user
  if (normalizedUsername !== currentUser.username) {
    const usernameTaken = await prisma.user.findFirst({
      where: { username: normalizedUsername, id: { not: currentUser.id } },
    });
    if (usernameTaken) throw new Error("username_taken");
  }

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: data.name,
      username: normalizedUsername,
    },
  });

  // Invalidate only this user's cache
  revalidateTag(getUserCacheTag(currentUser.id), {});

  return updatedUser;
}
