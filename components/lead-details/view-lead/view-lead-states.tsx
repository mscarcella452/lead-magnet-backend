"use client";

import { RefObject } from "react";
import { LeadTabs } from "@/components/lead-details/view-lead/tabs/lead-tabs";
import {
  ViewLeadSkeleton,
  ViewLeadError,
  ViewLeadDetails,
} from "@/components/lead-details/view-lead/states";
import { useLeadWithRelations } from "@/components/lead-details/lib/hooks/useLeadWithRelations";
import type { ViewLeadDialogPayload } from "@/types/ui/dialog";

interface ViewLeadStatesProps extends ViewLeadDialogPayload {
  contentRef: RefObject<HTMLDivElement>;
}

export function ViewLeadStates({
  leadId,
  contentRef,
  onConfirm,
}: ViewLeadStatesProps) {
  const leadState = useLeadWithRelations(leadId);

  return (
    <LeadTabs>
      {leadState.status === "loading" && <ViewLeadSkeleton />}
      {leadState.status === "error" && (
        <ViewLeadError message={leadState.error} />
      )}
      {leadState.status === "success" && (
        <ViewLeadDetails
          lead={leadState.lead}
          contentRef={contentRef}
          onConfirm={onConfirm}
        />
      )}
    </LeadTabs>
  );
}
