import "server-only";
import { UserRole } from "@prisma/client";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";
import { sendInviteEmail } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth-helpers";
import { generateInviteToken } from "@/lib/server/utils";
import { ADMIN_ROLES } from "@/lib/auth/constants";

// ============================================================
// Types
// ============================================================

export interface InviteTeamMemberInput {
  name: string;
  email: string;
  role: UserRole;
}

// ============================================================
// constants
// ============================================================

// Use ADMIN_ROLES from constants (owner, admin)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// utilities
// ============================================================

async function generateUniqueUsername(name: string): Promise<string> {
  const base = name.toLowerCase().replace(/\s+/g, ".");
  while (true) {
    const suffix = crypto.randomBytes(4).toString("hex");
    const username = `${base}.${suffix}`;
    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) return username;
  }
}

// ============================================================
// inviteTeamMember
// ============================================================

export async function inviteTeamMember(
  data: InviteTeamMemberInput,
): Promise<void> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");
  if (!ADMIN_ROLES.includes(currentUser.role as never))
    throw new Error("Unauthorized");

  const { name, email, role } = data;

  if (role === "DEV") throw new Error("Cannot create DEV users from admin UI");
  if (!EMAIL_REGEX.test(email)) throw new Error("Invalid email address");

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) throw new Error("Email already exists");

  const username = await generateUniqueUsername(name);
  const user = await prisma.user.create({
    data: { name, email, role, username },
  });

  const { token, expiresAt } = generateInviteToken();
  const invite = await prisma.userInvite.create({
    data: { userId: user.id, token, expiresAt },
  });

  try {
    await sendInviteEmail(email, name, token);
  } catch {
    await prisma.userInvite.delete({ where: { id: invite.id } });
    throw new Error("Failed to send invite email");
  }

  revalidateTag(CACHE_TAGS.TEAM_MEMBERS);
}
