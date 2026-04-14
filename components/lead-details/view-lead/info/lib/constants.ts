import { Mail, Phone, Globe, Video, LucideIcon } from "lucide-react";
import { LeadContactMeta } from "@/components/lead-details/lib/types";
import { LeadFieldKey } from "@/types/leads/fields";

// ====================================================
// Constants
// ====================================================

/**
 * Defines the available one-tap contact actions for a lead.
 *
 * Each entry declares:
 * - `key`        — stable identifier used for grouping and deduplication
 * - `icon`       — Lucide icon rendered in the action button
 * - `label`      — visible button label
 * - `buildHref`  — transforms the raw field value into an actionable URL scheme
 * - `requires`   — the LeadContactMeta field that must be present for this action to appear
 *
 * To add a new action, append an entry here — no other changes are needed.
 */
export const CONTACT_ACTION_CONFIGS: Array<{
  key: string;
  icon: LucideIcon;
  label: string;
  buildHref: (value: string) => string;
  requires: keyof LeadContactMeta;
}> = [
  {
    key: "email",
    icon: Mail,
    label: "Message",
    buildHref: (email) => `mailto:${email}`,
    requires: "email",
  },
  {
    key: "phone",
    icon: Phone,
    label: "Call",
    buildHref: (phone) => `tel:${phone.replace(/\D/g, "")}`,
    requires: "phone",
  },
  // {
  //   key: "video",
  //   icon: Video,
  //   label: "Video Call",
  //   buildHref: (phone) => `facetime:${phone.replace(/\D/g, "")}`,
  //   requires: "phone",
  // },
  {
    key: "website",
    icon: Globe,
    label: "Visit",
    buildHref: (website) => website,
    requires: "website",
  },
];

/**
 * Fields rendered outside the dynamic section body in both views.
 * Excluded from info rows and edit form rows to avoid duplication.
 */
export const EXCLUDED_SECTION_FIELDS = new Set<LeadFieldKey>(["name"]);
