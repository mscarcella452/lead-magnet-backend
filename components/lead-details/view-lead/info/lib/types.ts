import { BadgeProps } from "@/components/ui/feedback/badge";
import { LucideIcon } from "lucide-react";
import { BaseSection } from "@/components/lead-details/lib/types";

// ====================================================
// Types
// ====================================================

export interface ContactAction {
  key: string;
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface InfoRowProps {
  label: string;
  value: string | null;
  actions?: ContactAction[];
  contentOrientation?: "grid" | "flex";
}

export interface SummaryRowProps {
  label: string;
  value: string | null;
  variant?: BadgeProps["variant"];
}

export type DynamicSection = BaseSection<InfoRowProps>;
