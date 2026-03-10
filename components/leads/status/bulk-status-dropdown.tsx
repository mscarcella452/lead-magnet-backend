import { LeadStatus } from "@prisma/client";
import { STATUS_CONFIG } from "@/config/lead-config";
import {
  BulkUpdateDropdown,
  BulkUpdateDropdownProps,
} from "@/components/leads/shared/bulk-update-dropdown";
import { CheckCircle2 } from "lucide-react";
import { ButtonProps } from "@/components/ui/controls";
import { bulkUpdateLeadStatusAction } from "@/lib/server/actions/write/bulkUpdateLeadStatusAction";
import { toast } from "sonner";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";

export interface BulkStatusDropdownProps extends ButtonProps {
  selectedLeads: Set<string>;
  onSuccess: () => void;
}

export function BulkStatusDropdown({
  selectedLeads,
  onSuccess,
  ...props
}: BulkStatusDropdownProps) {
  const handleStatusChange = async (status: LeadStatus) => {
    const result = await bulkUpdateLeadStatusAction({
      leadIds: Array.from(selectedLeads),
      newStatus: status,
      performedBy: "current-user-id",
    });

    if (result.success) {
      toast.success(
        `Updated ${selectedLeads.size} lead${selectedLeads.size !== 1 ? "s" : ""} to ${STATUS_CONFIG[status].label}`,
      );
      selectedLeads.forEach((leadId) =>
        invalidateLeadWithRelationsCache(leadId),
      );
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to bulk update lead statuses");
    }
  };
  return (
    <BulkUpdateDropdown
      triggerIcon={CheckCircle2}
      triggerLabel="Status"
      config={STATUS_CONFIG}
      onUpdateChange={handleStatusChange}
      aria-label="Change status of selected leads"
      {...props}
    />
  );
}
