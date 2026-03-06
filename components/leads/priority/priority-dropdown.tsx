import { LeadPriority } from "@prisma/client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { PRIORITY_CONFIG } from "@/config/lead-config";
import { Chip, ChipProps } from "@/components/ui/controls/chip";
import { Check, ChevronDown } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface PriorityDropdownProps extends ChipProps {
  currentPriority: LeadPriority;
  onPriorityChange: (priority: LeadPriority) => void | Promise<void>;
}

// ============================================================================
// Constants
// ============================================================================

const PRIORITY_ENTRIES = Object.entries(PRIORITY_CONFIG) as [
  LeadPriority,
  (typeof PRIORITY_CONFIG)[LeadPriority],
][];

// ============================================================================
// STATUSDROPDOWN
// ============================================================================

function PriorityDropdown({
  currentPriority,
  onPriorityChange,
  ...props
}: PriorityDropdownProps) {
  const [priority, setPriority] = useState<LeadPriority>(currentPriority);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePriorityChange = async (nextPriority: LeadPriority) => {
    if (nextPriority === priority) return;

    const prevPriority = priority;
    setPriority(nextPriority);
    setIsUpdating(true);

    try {
      await onPriorityChange(nextPriority);
    } catch (error) {
      setPriority(prevPriority);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const currentConfig = PRIORITY_CONFIG[priority];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Chip
          variant={currentConfig.variant}
          intent="outline"
          size="sm"
          aria-label={`Current status: ${currentConfig.label}. Click to change status.`}
          {...props}
        >
          {currentConfig.label}
          <ChevronDown aria-hidden="true" />
        </Chip>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {PRIORITY_ENTRIES.map(([optionPriority, config]) => {
            const isCurrentPriority = optionPriority === priority;

            return (
              <DropdownMenuItem
                key={optionPriority}
                onClick={() => handlePriorityChange(optionPriority)}
                className="flex items-center justify-between gap-2"
                aria-current={isCurrentPriority ? "true" : undefined}
              >
                <span>{config.label}</span>
                {isCurrentPriority && <Check aria-hidden="true" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { PriorityDropdown, type PriorityDropdownProps };
