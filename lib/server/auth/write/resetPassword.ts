import "server-only";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// ==============================================
// resetPassword
// ==============================================

/**
 * Validates reset token, updates password,
 * and deletes the reset token on success.
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<{ username: string }> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) throw new Error("invalid_token");
  if (new Date() > resetToken.expiresAt) throw new Error("token_expired");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  return { username: resetToken.user.username };
}
