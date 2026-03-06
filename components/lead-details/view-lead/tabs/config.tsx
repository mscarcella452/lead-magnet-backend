import {
  FolderKanban,
  Contact,
  NotebookText,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { LeadOverview } from "@/components/lead-details/view-lead/overview/lead-overview";
import { LeadInfo } from "@/components/lead-details/view-lead/info/lead-info";
import { LeadNotes } from "@/components/lead-details/view-lead/notes/lead-notes";
import { LeadActivity } from "@/components/lead-details/view-lead/activity/lead-activity";
import type { LeadWithRelations } from "@/types";
import type { ComponentType } from "react";

// ============================================================================
// Types
// ============================================================================

export interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  Component: ComponentType<{ lead: LeadWithRelations }>;
}

// ============================================================================
// Config
// ============================================================================

export const TAB_ITEMS: TabItem[] = [
  {
    value: "overview",
    label: "Overview",
    icon: FolderKanban,
    Component: LeadOverview,
  },
  { value: "info", label: "Info", icon: Contact, Component: LeadInfo },
  { value: "notes", label: "Notes", icon: NotebookText, Component: LeadNotes },
  {
    value: "activity",
    label: "Activity",
    icon: Activity,
    Component: LeadActivity,
  },
];
