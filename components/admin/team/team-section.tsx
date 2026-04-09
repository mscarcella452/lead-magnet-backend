import "server-only";

import { auth } from "@/auth";
import { getTeamMembers } from "@/lib/server/team/read/getTeamMembers";
import { TeamTable } from "@/components/admin/team/table/team-table";

export async function TeamSection() {
  const [session, members] = await Promise.all([
    auth(),
    getTeamMembers(),
  ]);

  const currentUserRole = session?.user?.role;

  return <TeamTable initialMembers={members} currentUserRole={currentUserRole} />;
}
