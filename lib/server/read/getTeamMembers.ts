import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/server/constants";
import { UserRole } from "@prisma/client";

// ============================================================================
// Types
// ============================================================================
export interface TeamMember {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: UserRole;
  password: string | null;
  createdAt: string;
  invite?: {
    expiresAt: string;
  } | null;
}

// ============================================================================
// Internal fetch function
// ============================================================================
async function fetchTeamMembers(): Promise<TeamMember[]> {
  const users = await prisma.user.findMany({
    where: {
      role: { not: "DEV" },
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      password: true,
      createdAt: true,
      invite: {
        select: {
          expiresAt: true,
        },
      },
    },
  });

  // Sort: OWNER first, then by role ascending
  return users
    .sort((a, b) => {
      if (a.role === "OWNER") return -1;
      if (b.role === "OWNER") return 1;
      return a.role.localeCompare(b.role);
    })
    .map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      invite: user.invite
        ? { expiresAt: user.invite.expiresAt.toISOString() }
        : null,
    }));
}

// ============================================================================
// Cached export
// Cache revalidates every 60 seconds or when TEAM_MEMBERS tag is invalidated.
// ============================================================================
export const getTeamMembers = unstable_cache(
  fetchTeamMembers,
  [CACHE_TAGS.TEAM_MEMBERS, "list"],
  { revalidate: 60, tags: [CACHE_TAGS.TEAM_MEMBERS] },
);
