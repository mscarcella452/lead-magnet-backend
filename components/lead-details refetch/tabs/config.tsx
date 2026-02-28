import { FolderKanban, Contact, NotebookText, Activity } from "lucide-react";
import {
  LeadOverview,
  LeadInfo,
  LeadNotes,
  LeadActivity,
  LeadDemoInfo,
} from "@/components/lead-details/sections";

export const TAB_ITEMS = [
  {
    value: "overview",
    label: "Overview",
    icon: FolderKanban,
    Component: LeadOverview,
  },
  {
    value: "info",
    label: "Info",
    icon: Contact,
    Component: LeadInfo,
  },
  {
    value: "demo-info",
    label: "Demo",
    icon: Contact,
    Component: LeadDemoInfo,
  },
  {
    value: "notes",
    label: "Notes",
    icon: NotebookText,
    Component: LeadNotes,
  },
  {
    value: "activity",
    label: "Activity",
    icon: Activity,
    Component: LeadActivity,
  },
];
