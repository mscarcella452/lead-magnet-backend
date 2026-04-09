import "server-only";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import bcrypt from "bcryptjs";

interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function updatePassword(data: UpdatePasswordInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("unauthorized");

  // Get full user with password
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });
  if (!user || !user.password) throw new Error("unauthorized");

  // Verify current password
  const passwordValid = await bcrypt.compare(
    data.currentPassword,
    user.password,
  );
  if (!passwordValid) throw new Error("invalid_password");

  // Check that new password is different from current
  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);
  if (isSamePassword) throw new Error("password_same");

  // Hash new password
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  // Update password
  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: { password: hashedPassword },
  });

  return updatedUser;
}
