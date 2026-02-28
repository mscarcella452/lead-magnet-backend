import { LeadStatus } from "@prisma/client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG } from "@/config/lead-config";
import { Chip, ChipProps } from "@/components/ui/controls/chip";
import { Check, ChevronDown } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface StatusDropdownProps extends ChipProps {
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void | Promise<void>;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_ENTRIES = Object.entries(STATUS_CONFIG) as [
  LeadStatus,
  (typeof STATUS_CONFIG)[LeadStatus],
][];

// ============================================================================
// STATUSDROPDOWN
// ============================================================================

function StatusDropdown({
  currentStatus,
  onStatusChange,
  ...props
}: StatusDropdownProps) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (nextStatus: LeadStatus) => {
    if (nextStatus === status) return;

    const prevStatus = status;
    setStatus(nextStatus);
    setIsUpdating(true);

    try {
      await onStatusChange(nextStatus);
    } catch (error) {
      setStatus(prevStatus);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const currentConfig = STATUS_CONFIG[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Chip
          variant={currentConfig.variant}
          intent="soft"
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
          {STATUS_ENTRIES.map(([optionStatus, config]) => {
            const isCurrentStatus = optionStatus === status;

            return (
              <DropdownMenuItem
                key={optionStatus}
                onClick={() => handleStatusChange(optionStatus)}
                className="flex items-center justify-between gap-2"
                aria-current={isCurrentStatus ? "true" : undefined}
              >
                <span>{config.label}</span>
                {isCurrentStatus && <Check aria-hidden="true" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { StatusDropdown, type StatusDropdownProps };
