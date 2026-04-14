import { LeadPriority } from "@prisma/client";
import { PRIORITY_CONFIG } from "@/config/field-controls-config";
import { BulkUpdateDropdown } from "../shared/bulk-update-dropdown";
import { ButtonProps } from "@/components/ui/controls";
import { bulkUpdateLeadPriorityAction } from "@/lib/server/leads/actions/write/bulkUpdateLeadPriorityAction";
import { toast } from "sonner";
import { invalidateLeadWithRelationsCache } from "@/lib/server/leads/cache";

export interface BulkPriorityDropdownProps extends ButtonProps {
  selectedLeads: Set<string>;
  onSuccess: () => void;
}

export function BulkPriorityDropdown({
  selectedLeads,
  onSuccess,
  ...props
}: BulkPriorityDropdownProps) {
  const handlePriorityChange = async (priority: LeadPriority) => {
    const result = await bulkUpdateLeadPriorityAction({
      leadIds: Array.from(selectedLeads),
      newPriority: priority,
    });

    if (result.success) {
      toast.success(
        `Updated ${selectedLeads.size} lead${selectedLeads.size !== 1 ? "s" : ""} to ${PRIORITY_CONFIG[priority].label}`,
      );
      selectedLeads.forEach((leadId) =>
        invalidateLeadWithRelationsCache(leadId),
      );
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to bulk update lead priorities");
    }
  };

  return (
    <BulkUpdateDropdown
      triggerLabel="Priority"
      config={PRIORITY_CONFIG}
      onUpdateChange={handlePriorityChange}
      aria-label="Change priority of selected leads"
      {...props}
    />
  );
}
