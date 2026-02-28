import { LeadStatus } from "@prisma/client";
import { Badge, BadgeProps } from "@/components/ui/feedback/badge";
import { STATUS_CONFIG } from "@/config/lead-config";

// ============================================================================
// Types
// ============================================================================

interface StatusBadgeProps extends BadgeProps {
  status: LeadStatus;
}

// ============================================================================
// STATUSBADGE
// ============================================================================

const StatusBadge = ({ status, ...props }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      intent="soft"
      size="sm"
      aria-label={`Status: ${config.label}`}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

export { StatusBadge, type StatusBadgeProps };
