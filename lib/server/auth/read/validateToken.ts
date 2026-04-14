import "server-only";
import { prisma } from "@/lib/db";
import type { TokenType } from "@/types/auth";
import type { TokenValidationResult } from "@/types/server/actions";

const TOKEN_QUERIES = {
  invite: (token: string) =>
    prisma.userInvite.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    }),
  passwordReset: (token: string) =>
    prisma.passwordResetToken.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    }),
  emailVerification: (token: string) =>
    prisma.emailVerificationToken.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    }),
} satisfies Record<
  TokenType,
  (token: string) => Promise<{ userId: string; expiresAt: Date } | null>
>;

export async function validateToken(
  token: string,
  type: TokenType,
): Promise<TokenValidationResult> {
  const record = await TOKEN_QUERIES[type](token);
  if (!record) return { valid: false, reason: "not_found" };
  if (new Date() > record.expiresAt) return { valid: false, reason: "expired" };
  return { valid: true, userId: record.userId };
}
