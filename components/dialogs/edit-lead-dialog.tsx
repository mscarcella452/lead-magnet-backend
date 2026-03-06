import { DialogContent, DialogTitle } from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";
import { EditLeadStates } from "@/components/lead-details/edit-lead/edit-lead-states";
import type { EditLeadDialogPayload } from "@/types/ui/dialog";

// ============================================================================
// EditLeadDialog
// ============================================================================

export function EditLeadDialog({
  leadId,
  onLeadUpdated,
}: EditLeadDialogPayload) {
  return (
    <DialogContent
      layout="responsiveModal"
      spacing="none"
      contentClassName="relative"
      aria-describedby={undefined}
    >
      <DialogTitle className="sr-only">Edit Lead</DialogTitle>
      <Container spacing="block" className="@container">
        <EditLeadStates leadId={leadId} onLeadUpdated={onLeadUpdated} />
      </Container>
    </DialogContent>
  );
}
