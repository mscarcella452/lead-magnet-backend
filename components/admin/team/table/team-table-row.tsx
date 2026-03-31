import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { formatDate } from "@/lib/utils/dates";
import { TeamRowActions } from "./team-row-actions";
import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/layout/table";
import {
  UserStatusBadge,
  UserRoleBadge,
} from "@/components/admin/team/table/badges";
import { Container } from "@/components/ui/layout/containers";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/layout/avatar";
import { Checkbox } from "@/components/ui/controls/checkbox";

// ============================================================
// Utils
// ============================================================
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts[0][0] + parts[1][0] : name[0];
};
// ============================================================
// types
// ============================================================

interface TeamTableRowProps {
  member: TeamMember;
}
// ============================================================
// Team Table Row
// ============================================================

export const TeamTableRow = memo(function TeamTableRow({
  member,
}: TeamTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Container
          spacing="group"
          className="text-start flex flex-row items-center min-w-0"
        >
          <Avatar>
            <AvatarImage src={member?.avatar} alt={member.name} />
            <AvatarFallback delayMs={600}>
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
            <span className="font-medium">{member.name}</span>
            <span className="text-muted-foreground col-start-2 truncate">
              {member.email}
            </span>
          </div>
        </Container>
      </TableCell>
      <TableCell>
        <UserRoleBadge role={member.role} />
      </TableCell>
      {/* <TableCell className="truncate max-w-[50px]">{member.email}</TableCell> */}
      <TableCell>
        <UserStatusBadge member={member} />
      </TableCell>
      <TableCell>
        <time
          className="text-xs text-subtle-foreground"
          dateTime={member.createdAt}
        >
          {formatDate(member.createdAt)}
        </time>
      </TableCell>
      <TableCell>
        <TeamRowActions member={member} />
      </TableCell>
    </TableRow>
  );
});
