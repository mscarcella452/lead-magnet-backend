import "server-only";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";

interface UpdateProfileInput {
  name: string;
  username: string;
}

export async function updateProfile(data: UpdateProfileInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("unauthorized");

  // Check if username is taken by another user
  if (data.username !== currentUser.username) {
    const usernameTaken = await prisma.user.findFirst({
      where: { username: data.username, id: { not: currentUser.id } },
    });
    if (usernameTaken) throw new Error("username_taken");
  }

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: data.name,
      username: data.username,
    },
  });

  return updatedUser;
}
