import { LeadPriority } from "@prisma/client";
import { PRIORITY_CONFIG } from "@/config/lead-config";
import {
  UpdateDropdown,
  UpdateDropdownProps,
} from "@/components/leads/shared/update-dropdown";

export interface PriorityDropdownProps extends Omit<
  UpdateDropdownProps<LeadPriority>,
  "current" | "config" | "onUpdateChange"
> {
  currentPriority: LeadPriority;
  onPriorityChange: (priority: LeadPriority) => void | Promise<void>;
}

export function PriorityDropdown({
  currentPriority,
  onPriorityChange,
  ...props
}: PriorityDropdownProps) {
  return (
    <UpdateDropdown
      current={currentPriority}
      config={PRIORITY_CONFIG}
      onUpdateChange={onPriorityChange}
      intent="outline"
      aria-label={`Current priority: ${PRIORITY_CONFIG[currentPriority].label}. Click to change priority.`}
      {...props}
    />
  );
}
