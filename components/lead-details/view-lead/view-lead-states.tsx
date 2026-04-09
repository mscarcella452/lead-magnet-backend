"use client";

import { RefObject } from "react";
import {
  ViewLeadSkeleton,
  ViewLeadError,
  ViewLeadDetails,
} from "@/components/lead-details/view-lead/states";
import { useLeadWithRelations } from "@/components/lead-details/lib/hooks/useLeadWithRelations";
import type { ViewLeadDialogPayload } from "@/types/ui/dialog";

interface ViewLeadStatesProps extends ViewLeadDialogPayload {
  contentRef: RefObject<HTMLDivElement | null>;
}

export function ViewLeadStates({
  leadId,
  contentRef,
  onConfirm,
}: ViewLeadStatesProps) {
  const leadState = useLeadWithRelations(leadId);

  if (leadState.status === "loading") return <ViewLeadSkeleton />;
  if (leadState.status === "error") return <ViewLeadError />;
  return (
    <ViewLeadDetails
      lead={leadState.lead}
      contentRef={contentRef}
      onConfirm={onConfirm}
    />
  );
}
