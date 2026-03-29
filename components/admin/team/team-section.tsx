import "server-only";

import { getTeamMembers } from "@/lib/server/read/getTeamMembers";
import { TeamTable } from "@/components/admin/team/table/team-table";

export async function TeamSection() {
  const members = await getTeamMembers();

  return <TeamTable initialMembers={members} />;
}
