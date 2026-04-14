import "server-only";

import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { getTeamMembers } from "@/lib/server/team/read/getTeamMembers";
import { TeamTable } from "@/components/admin/team/table/team-table";

export async function TeamSection() {
  const [user, members] = await Promise.all([
    getCurrentUser(),
    getTeamMembers(),
  ]);

  return (
    <TeamTable
      initialMembers={members}
      currentUserRole={user?.role}
      currentUserId={user?.id}
    />
  );
}
