"use client";
import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { memo } from "react";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================
// Types
// ============================================================

type UserStatusKey = "ACTIVE" | "PENDING" | "EXPIRED";

export interface OptionConfig {
  label: string;
  variant: "success" | "warning" | "destructive" | "primary";
}

// ============================================================
// Config
// ============================================================

export const STATUS_CONFIG: Record<UserStatusKey, OptionConfig> = {
  ACTIVE: { label: "Active", variant: "success" },
  PENDING: { label: "Pending Setup", variant: "warning" },
  EXPIRED: { label: "Invite Expired", variant: "destructive" },
};

export const STATUS_OPTIONS = [
  "ACTIVE",
  "PENDING",
  "EXPIRED",
] satisfies UserStatusKey[];

// ============================================================
// Utilities
// ============================================================

function isInviteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

function getStatusKey(member: TeamMember): UserStatusKey {
  if (member.password) {
    return "ACTIVE";
  }
  if (member.invite) {
    return isInviteExpired(member.invite.expiresAt) ? "EXPIRED" : "PENDING";
  }
  return "ACTIVE";
}

// ============================================================
// User Status Badge
// ============================================================

export const UserStatusBadge = memo(function UserStatusBadge({
  member,
}: {
  member: TeamMember;
}) {
  const statusKey = getStatusKey(member);
  const config = STATUS_CONFIG[statusKey];

  return (
    <Badge
      size="sm"
      variant={config.variant}
      intent="outline"
      aria-label={`Status: ${config.label}`}
      className="mx-auto"
    >
      {config.label}
    </Badge>
  );
});
