import "server-only";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getUserCacheTag } from "@/lib/server/constants";

// =============================================
// verifyEmailChange
// =============================================

/**
 * Validates email verification token, updates user email,
 * and deletes the verification token on success.
 */
export async function verifyEmailChange(
  token: string,
): Promise<{ email: string }> {
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) throw new Error("invalid_token");
  if (new Date() > verificationToken.expiresAt)
    throw new Error("token_expired");

  // Update user email
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { email: verificationToken.newEmail },
  });

  // Delete verification token
  await prisma.emailVerificationToken.delete({
    where: { id: verificationToken.id },
  });

  // Invalidate only this user's cache (email is a cached field)
  revalidateTag(getUserCacheTag(verificationToken.userId), {});

  return { email: verificationToken.newEmail };
}
