"use client";

import { RefObject } from "react";
import { LeadHeader } from "@/components/lead-details/view-lead/header/lead-header";
import {
  ViewLeadHeader,
  ViewLeadBody,
} from "@/components/lead-details/view-lead/shared/view-lead-shell";
import {
  LeadTabs,
  LeadTabsContent,
} from "@/components/lead-details/view-lead/tabs/lead-tabs";
import type { LeadWithRelations } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface ViewLeadDetailsProps {
  lead: LeadWithRelations;
  contentRef: RefObject<HTMLDivElement>;
  onLeadUpdated: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function ViewLeadDetails({
  lead,
  contentRef,
  onLeadUpdated,
}: ViewLeadDetailsProps) {
  return (
    <LeadTabs>
      <ViewLeadHeader>
        <LeadHeader lead={lead} onLeadUpdated={onLeadUpdated} />
      </ViewLeadHeader>
      <ViewLeadBody>
        <LeadTabsContent lead={lead} contentRef={contentRef} />
      </ViewLeadBody>
    </LeadTabs>
  );
}
