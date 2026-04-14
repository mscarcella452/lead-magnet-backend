import { LeadPriority } from "@prisma/client";
import { Badge, BadgeProps } from "@/components/ui/feedback/badge";
import { PRIORITY_CONFIG } from "@/config/field-controls-config";

// ============================================================================
// Types
// ============================================================================

export interface PriorityBadgeProps extends BadgeProps {
  priority: LeadPriority;
}

// ============================================================================
// PRIORITYBADGE
// ============================================================================

export const PriorityBadge = ({ priority, ...props }: PriorityBadgeProps) => {
  const config = PRIORITY_CONFIG[priority];

  return (
    <Badge
      variant={config.variant}
      intent="soft"
      size="sm"
      aria-label={`Priority: ${config.label}`}
      {...props}
    >
      {config.label}
    </Badge>
  );
};
