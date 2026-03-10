"use client";

import { useRef } from "react";
import { DialogContent, DialogTitle } from "@/components/ui/feedback/dialog";
import { ViewLeadStates } from "@/components/lead-details/view-lead/view-lead-states";
import type { ViewLeadDialogPayload } from "@/types/ui/dialog";

export function ViewLeadDialog(payload: ViewLeadDialogPayload) {
  const contentRef = useRef<HTMLDivElement>(null);

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
      <ViewLeadStates {...payload} contentRef={contentRef} />
    </DialogContent>
  );
}
