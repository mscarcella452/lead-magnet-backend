import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ==============================================
// completeUserInvite
// ==============================================
/**
 * Validates invite token, updates username + password,
 * deletes the invite. Returns the username on success.
 */
export async function completeUserInvite(
  token: string,
  username: string,
  password: string,
): Promise<{ username: string }> {
  const invite = await prisma.userInvite.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!invite) throw new Error("invalid_token");
  if (new Date() > invite.expiresAt) throw new Error("token_expired");

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser && existingUser.id !== invite.userId) {
    throw new Error("username_taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: invite.userId },
    data: { username, password: hashedPassword },
  });

  await prisma.userInvite.delete({ where: { id: invite.id } });

  return { username };
}
