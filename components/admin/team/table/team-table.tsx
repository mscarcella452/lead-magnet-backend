"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/layout/table";
import { TeamMember } from "@/lib/server/team/read/getTeamMembers";
import { TeamTableRow } from "@/components/admin/team/table/team-table-row";

// ============================================================
// types
// ============================================================

interface TeamTableProps {
  initialMembers: TeamMember[];
  currentUserRole?: string;
}

// ============================================================
// Constants
// ============================================================

const TABLE_HEADERS = [
  "Name",
  "Username",
  "Role",
  // "Email",
  "Status",
] as const;

// ============================================================
// Team Table
// ============================================================

export function TeamTable({ initialMembers, currentUserRole }: TeamTableProps) {
  return (
    <Table role="region" aria-label="Team table" className="@5xl:table-fixed">
      <TableHeader>
        <TableRow hoverable={false}>
          {TABLE_HEADERS.map((header) => (
            <TableHead key={header} scope="col">
              {header}
            </TableHead>
          ))}
          <TableHead scope="col" className="w-48">
            Created
          </TableHead>
          <TableHead scope="col" className="w-24">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialMembers.map((member) => (
          <TeamTableRow
            key={member.id}
            member={member}
            currentUserRole={currentUserRole}
          />
        ))}
      </TableBody>
    </Table>
  );
}
