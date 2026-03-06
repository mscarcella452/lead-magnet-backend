"use client";

import type { LeadsPanelProps } from "@/components/leads/panel/lib/types";
import { LeadsPanelContent } from "@/components/leads/panel/leads-panel-content";
import { LeadsPanelError } from "@/components/leads/panel/leads-panel-error";

// ============================================================================
// Leads Panel — public API, guards against error state
// ============================================================================

export const LeadsPanel = (props: LeadsPanelProps) => {
  if (props.error) {
    return <LeadsPanelError message={props.error} />;
  }

  return <LeadsPanelContent initialLeadData={props.initialLeadData!} />;
};
