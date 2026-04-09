import "server-only";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import bcrypt from "bcryptjs";
import { sendEmailVerificationEmail } from "@/lib/server/email/send/sendEmailVerificationEmail";
import { generateToken } from "@/lib/server/utils";
import { EXPIRY_MS } from "@/lib/server/constants";

interface RequestEmailChangeInput {
  email: string;
  currentPassword: string;
}

export async function requestEmailChange(data: RequestEmailChangeInput) {
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

  // Check if email is already in use by another user
  const emailTaken = await prisma.user.findFirst({
    where: { email: data.email, id: { not: currentUser.id } },
  });
  if (emailTaken) throw new Error("email_taken");

  // Generate verification token
  const { token, expiresAt } = generateToken(EXPIRY_MS.emailVerification);

  // Delete any existing email verification token for this user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: currentUser.id },
  });

  // Create new email verification token
  await prisma.emailVerificationToken.create({
    data: {
      userId: currentUser.id,
      token,
      newEmail: data.email,
      expiresAt,
    },
  });

  // Send verification email to the NEW email address
  const emailResult = await sendEmailVerificationEmail(
    data.email,
    user.name,
    data.email,
    token,
    expiresAt,
  );

  if (!emailResult.success) {
    // If email fails, delete the token and throw error
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: currentUser.id },
    });
    throw new Error("email_send_failed");
  }

  return { token };
}
