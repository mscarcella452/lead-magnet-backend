import { TeamMember } from "@/lib/server/team/read/getTeamMembers";
import { formatDate } from "@/lib/utils/dates";
import { TeamRowActions } from "./team-row-actions";
import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/layout/table";
import { InviteStatusBadge } from "@/components/field-controls/invite-status";
import { Container } from "@/components/ui/layout/containers";
import { UserAvatar } from "@/components/avatars/user-avatar";
import { Badge } from "@/components/ui/feedback/badge";
import { RoleDropdown } from "@/components/field-controls/role";
import { UserRole } from "@prisma/client";

// ============================================================
// types
// ============================================================

interface TeamTableRowProps {
  member: TeamMember;
  currentUserRole?: UserRole;
  currentUserId?: string;
}
// ============================================================
// Team Table Row
// ============================================================

export const TeamTableRow = memo(function TeamTableRow({
  member,
  currentUserRole,
  currentUserId,
}: TeamTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Container
          spacing="group"
          className="text-start flex flex-row items-center min-w-0"
        >
          <UserAvatar
            // src={null}
            // src={member.avatar}
            name={member.name}
            size="xs"
            // delayMs={600}
          />

          <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
            <span className="font-medium capitalize">{member.name}</span>
            <span className="text-muted-foreground col-start-2 truncate">
              {member.email}
            </span>
          </div>
        </Container>
      </TableCell>
      <TableCell className="min-w-0 max-w-0">
        <Badge
          intent="outline"
          size="sm"
          className="flex min-w-0 max-w-full mx-auto"
        >
          <span className="truncate">{member.username}</span>
        </Badge>
      </TableCell>
      <TableCell>
        <RoleDropdown
          userId={member.id}
          currentRole={member.role}
          currentUserId={currentUserId}
        />
      </TableCell>
      {/* <TableCell className="truncate max-w-[50px]">{member.email}</TableCell> */}
      <TableCell>
        <InviteStatusBadge member={member} />
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
        <TeamRowActions
          member={member}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      </TableCell>
    </TableRow>
  );
});
