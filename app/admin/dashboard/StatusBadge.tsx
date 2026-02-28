"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LeadStatus } from "@prisma/client";
import { Chip } from "@/components/ui/controls";
import { updateLeadStatusAction } from "@/lib/server/actions/write/updateLeadStatusAction";

interface StatusBadgeProps {
  leadId: string;
  currentStatus: LeadStatus;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    variant: "info" | "warning" | "purple" | "success" | "destructive";
  }
> = {
  NEW: { label: "New", variant: "info" },
  CONTACTED: { label: "Contacted", variant: "warning" },
  QUALIFIED: { label: "Qualified", variant: "purple" },
  CONVERTED: { label: "Converted", variant: "success" },
  LOST: { label: "Lost", variant: "destructive" },
};

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
];

export function StatusBadge({ leadId, currentStatus }: StatusBadgeProps) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (newStatus === status || isUpdating) return;

    setIsUpdating(true);
    const previousStatus = status;

    try {
      const result = await updateLeadStatusAction({ leadId, newStatus });

      setStatus(newStatus);
      if (result.success) {
        const successMessage = `Lead Status updated from ${previousStatus} to ${newStatus}`;

        toast.success(successMessage);
      } else {
        toast.error(result.error);
        setStatus(previousStatus);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const config = STATUS_CONFIG[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Chip variant={config.variant} intent="soft" size="sm">
          {config.label}
          <ChevronDown />
        </Chip>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {STATUS_OPTIONS.map((option) => {
          const optionConfig = STATUS_CONFIG[option];
          return (
            <DropdownMenuGroup key={option}>
              <DropdownMenuItem
                onClick={() => handleStatusChange(option)}
                className="flex items-center justify-between gap-2"
              >
                <span>{optionConfig.label}</span>
                {option === status && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
