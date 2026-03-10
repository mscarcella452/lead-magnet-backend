import { LeadPriority } from "@prisma/client";
import { PRIORITY_CONFIG } from "@/config/lead-config";
import { BulkUpdateDropdown } from "@/components/leads/shared/bulk-update-dropdown";
import { Flame } from "lucide-react";
import { ButtonProps } from "@/components/ui/controls";
import { bulkUpdateLeadPriorityAction } from "@/lib/server/actions/write/bulkUpdateLeadPriorityAction";
import { toast } from "sonner";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";

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
      performedBy: "current-user-id",
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
      triggerIcon={Flame}
      triggerLabel="Priority"
      config={PRIORITY_CONFIG}
      onUpdateChange={handlePriorityChange}
      aria-label="Change priority of selected leads"
      {...props}
    />
  );
}
