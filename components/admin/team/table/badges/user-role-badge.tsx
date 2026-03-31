import { UserRole } from "@prisma/client";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================
// Role Badge
// ============================================================

export interface UserRoleBadgeProps {
  role: UserRole;
}

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
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
