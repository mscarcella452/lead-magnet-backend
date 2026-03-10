// Fetches lead data and routes to the correct state component.
// Keeps EditLeadDialog as a pure dialog shell.

import { useLeadWithRelations } from "@/components/lead-details/lib/hooks/useLeadWithRelations";
import {
  EditLeadSkeleton,
  EditLeadError,
  EditLeadDetails,
} from "@/components/lead-details/edit-lead/states";
import type { EditLeadDialogPayload } from "@/types/ui/dialog";

// ============================================================================
// Component
// ============================================================================

export function EditLeadStates({ leadId, onConfirm }: EditLeadDialogPayload) {
  const leadState = useLeadWithRelations(leadId);

  return (
    <>
      {leadState.status === "loading" && <EditLeadSkeleton />}
      {leadState.status === "error" && (
        <EditLeadError message={leadState.error} />
      )}
      {leadState.status === "success" && (
        <EditLeadDetails lead={leadState.lead} onConfirm={onConfirm} />
      )}
    </>
  );
}
