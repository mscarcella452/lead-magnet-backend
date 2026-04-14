import "server-only";

import { auth } from "@/auth";
import { getTeamMembers } from "@/lib/server/team/read/getTeamMembers";
import { TeamTable } from "@/components/admin/team/table/team-table";
import { UserRole } from "@prisma/client";

export async function TeamSection() {
  const [session, members] = await Promise.all([
    auth(),
    getTeamMembers(),
  ]);

  const currentUserRole = session?.user?.role as UserRole | undefined;
  const currentUserId = session?.user?.id;

  return (
    <TeamTable
      initialMembers={members}
      currentUserRole={currentUserRole}
      currentUserId={currentUserId}
    />
  );
}
