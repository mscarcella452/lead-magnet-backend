"use client";

import { useRef } from "react";
import { DialogContent, DialogTitle } from "@/components/ui/feedback/dialog";
import { ViewLeadStates } from "@/components/lead-details/view-lead/view-lead-states";
import { useLeadWithRelations } from "@/components/lead-details/lib/hooks/useLeadWithRelations";
import type { ViewLeadDialogPayload } from "@/types/ui/dialog";

export function ViewLeadDialog({
  leadId,
  onLeadUpdated,
}: ViewLeadDialogPayload) {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadState = useLeadWithRelations(leadId);

  return (
    <DialogContent
      variant="background"
      layout="drawer"
      enterFrom="right"
      rounded="none"
      spacing="none"
      border={false}
      contentClassName="relative"
      contentRef={contentRef}
      aria-describedby={undefined}
    >
      <DialogTitle className="sr-only">Lead Details</DialogTitle>
      <ViewLeadStates
        leadId={leadId}
        contentRef={contentRef}
        onLeadUpdated={onLeadUpdated}
      />
    </DialogContent>
  );
}
