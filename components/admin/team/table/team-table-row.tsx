import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { formatDate } from "@/lib/utils/dates";
import { TeamRowActions } from "./team-row-actions";
import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/layout/table";
import { Badge } from "@/components/ui/feedback/badge";
import { UserStatusBadge } from "@/components/admin/team/table/team-status-badge";
import { UserRole } from "@prisma/client";

// ============================================================
// Types
// ============================================================

interface TeamTableRowProps {
  member: TeamMember;
  isCurrentUser: boolean;
}

// ============================================================
// Role Badge
// ============================================================

interface RoleBadgeProps {
  role: UserRole;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const isOwner = role === "OWNER";
  const isAdmin = role === "ADMIN";
  return (
    <Badge
      size="sm"
      variant={isOwner ? "brand" : isAdmin ? "info" : "primary"}
      intent={isOwner || isAdmin ? "solid" : "soft"}
      className="mx-auto"
    >
      {role}
    </Badge>
  );
};

// ============================================================
// Team Table Row
// ============================================================

export const TeamTableRow = memo(function TeamTableRow({
  member,
  isCurrentUser,
}: TeamTableRowProps) {
  return (
    <TableRow>
      <TableCell className="truncate max-w-[200px]">{member.name}</TableCell>
      <TableCell className="min-w-[150px]">
        <RoleBadge role={member.role} />
      </TableCell>
      <TableCell className="truncate max-w-[250px]">{member.email}</TableCell>
      <TableCell className="min-w-[150px]">
        <UserStatusBadge member={member} />
      </TableCell>
      <TableCell>
        <time className="text-sm" dateTime={member.createdAt}>
          {formatDate(member.createdAt)}
        </time>
      </TableCell>
      <TableCell>
        <TeamRowActions member={member} isCurrentUser={isCurrentUser} />
      </TableCell>
    </TableRow>
  );
});
