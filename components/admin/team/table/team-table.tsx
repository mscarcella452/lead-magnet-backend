"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/layout/containers";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/layout/table";
import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { TeamTableRow } from "@/components/admin/team/table/team-table-row";

// ============================================================
// Constants
// ============================================================

const TABLE_HEADERS = [
  "Name",
  "Role",
  "Email",
  "Status",
  "Created",
  "Actions",
] as const;

// ============================================================
// Team Table
// ============================================================

interface TeamTableProps {
  initialMembers: TeamMember[];
}

export function TeamTable({ initialMembers }: TeamTableProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  return (
    <Container spacing="block" width="full">
      <Table role="region" aria-label="Team table">
        <TableHeader>
          <TableRow hoverable={false}>
            {TABLE_HEADERS.map((header) => (
              <TableHead key={header} scope="col">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialMembers.map((member) => (
            <TeamTableRow
              key={member.id}
              member={member}
              isCurrentUser={currentUserId === member.id}
            />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
