"use client";
import { TeamMember } from "@/lib/server/team/read/getTeamMembers";
import { memo } from "react";
import { Badge } from "@/components/ui/feedback/badge";
import { INVITE_STATUS_CONFIG, type InviteStatusKey } from "@/config/field-controls-config";

// ============================================================================
// Utilities
// ============================================================================

function isInviteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

function getInviteStatusKey(member: TeamMember): InviteStatusKey {
  if (member.password) {
    return "ACCEPTED";
  }
  if (member.invite) {
    return isInviteExpired(member.invite.expiresAt) ? "EXPIRED" : "PENDING";
  }
  return "ACCEPTED";
}

// ============================================================================
// Invite Status Badge
// ============================================================================

export const InviteStatusBadge = memo(function InviteStatusBadge({
  member,
}: {
  member: TeamMember;
}) {
  const statusKey = getInviteStatusKey(member);
  const config = INVITE_STATUS_CONFIG[statusKey];

  return (
    <Badge
      size="sm"
      variant={config.variant}
      intent="soft"
      aria-label={`Invite status: ${config.label}`}
      className="mx-auto"
    >
      {config.label}
    </Badge>
  );
});
