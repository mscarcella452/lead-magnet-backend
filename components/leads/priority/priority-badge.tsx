import { LeadPriority } from "@prisma/client";
import { Badge, BadgeProps } from "@/components/ui/feedback/badge";
import { PRIORITY_CONFIG } from "@/config/lead-config";

// ============================================================================
// Types
// ============================================================================

export interface PriorityBadgeProps extends BadgeProps {
  priority: LeadPriority;
}

// ============================================================================
// STATUSBADGE
// ============================================================================

export const PriorityBadge = ({ priority, ...props }: PriorityBadgeProps) => {
  const config = PRIORITY_CONFIG[priority];

  return (
    <Badge
      variant={config.variant}
      intent="outline"
      size="sm"
      aria-label={`Priority: ${config.label}`}
      {...props}
    >
      {config.label}
    </Badge>
  );
};
