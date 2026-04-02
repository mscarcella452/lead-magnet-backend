import "server-only";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateInviteToken } from "@/lib/server/utils";
import { isValidEmail } from "@/lib/utils/validation";

// ==============================================
// Types
// ==============================================

export interface RequestPasswordResetInput {
  email: string;
}

// ==============================================
// requestPasswordReset
// ==============================================

export async function requestPasswordReset({
  email,
}: RequestPasswordResetInput): Promise<void> {
  if (!isValidEmail(email)) throw new Error("Invalid email address");

  const user = await prisma.user.findUnique({ where: { email } });

  // Silently succeed if user not found — prevents email enumeration
  // Telling the user "that email doesn't exist" lets an attacker enumerate valid emails. Instead the form should always show a generic success message like "If that email exists, you'll receive a reset link shortly."
  if (!user) return;

  // Delete any existing reset token for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const { token, expiresAt } = generateInviteToken();

  const resetToken = await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const emailResult = await sendPasswordResetEmail(email, user.name, token);

  if (!emailResult.success) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    throw new Error(emailResult.error || "Failed to send password reset email");
  }
}
