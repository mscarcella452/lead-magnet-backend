import { LeadInfoSection } from "@/types/lead-fields";

// ====================================================
// Types
// ====================================================

export interface BaseSection<T> {
  section: LeadInfoSection;
  label: string;
  items: T[];
}

// // edit/lib/types.ts
// export type EditSection = BaseSection<EditRowProps>;

export interface LeadContactMeta {
  email?: string | null;
  phone?: string | null;
  website?: string | null;
}
