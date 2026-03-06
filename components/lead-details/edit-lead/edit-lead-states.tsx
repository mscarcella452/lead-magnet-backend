// Fetches lead data and routes to the correct state component.
// Keeps EditLeadDialog as a pure dialog shell.

import { useLeadWithRelations } from "@/components/lead-details/lib/hooks/useLeadWithRelations";
import {
  EditLeadSkeleton,
  EditLeadError,
  EditLeadDetails,
} from "@/components/lead-details/edit-lead/states";

// ============================================================================
// Types
// ============================================================================

interface EditLeadStatesProps {
  leadId: string;
  onLeadUpdated: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function EditLeadStates({ leadId, onLeadUpdated }: EditLeadStatesProps) {
  const leadState = useLeadWithRelations(leadId);

  return (
    <>
      {leadState.status === "loading" && <EditLeadSkeleton />}
      {leadState.status === "error" && (
        <EditLeadError message={leadState.error} />
      )}
      {leadState.status === "success" && (
        <EditLeadDetails lead={leadState.lead} onLeadUpdated={onLeadUpdated} />
      )}
    </>
  );
}
