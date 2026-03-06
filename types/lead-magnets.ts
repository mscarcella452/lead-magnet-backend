import type { LeadFieldKey } from "@/types/lead-fields";

// ===========================================================
// Lead Magnet Types
// Defines all available lead magnet identifiers in this app.
// ===========================================================
export type LeadMagnetType =
  | "FREE_TRIAL"
  | "FITNESS_ASSESSMENT"
  | "NUTRITION_PLAN"
  | "PERSONAL_TRAINING"
  | "MEMBERSHIP_SIGNUP"
  | "CONTACT_FORM";

// ===========================================================
// Lead Magnet Definition
// The shape of each entry in the LEAD_MAGNETS registry.
// Fields must reference keys that exist in LEAD_FIELD_REGISTRY.
// ===========================================================
export type LeadMagnetDefinition = {
  label: string;
  fields: readonly LeadFieldKey[];
};

// ===========================================================
// Lead Magnet Registry
// Single source of truth for each lead magnet's display
// label and the fields it collects. Field order here
// determines fallback render order within a section.
// ===========================================================
export const LEAD_MAGNETS: Record<LeadMagnetType, LeadMagnetDefinition> = {
  FREE_TRIAL: {
    label: "Free Trial Signup",
    fields: ["name", "email", "phone", "fitness_goal", "lead_source"],
  },
  FITNESS_ASSESSMENT: {
    label: "Fitness Assessment Request",
    fields: [
      "name",
      "email",
      "phone",
      "location",
      "fitness_goal",
      "lead_source",
      "campaign",
    ],
  },
  NUTRITION_PLAN: {
    label: "Nutrition Plan Signup",
    fields: [
      "name",
      "email",
      "phone",
      "fitness_goal",
      "dietary_restrictions",
      "lead_source",
    ],
  },
  PERSONAL_TRAINING: {
    label: "Personal Training Request",
    fields: [
      "name",
      "email",
      "phone",
      "fitness_goal",
      "preferred_trainer",
      "lead_source",
      "campaign",
    ],
  },
  MEMBERSHIP_SIGNUP: {
    label: "Membership Signup",
    fields: [
      "name",
      "email",
      "phone",
      "fitness_goal",
      "membership_type",
      "lead_source",
    ],
  },
  CONTACT_FORM: {
    label: "Website Contact Form",
    fields: ["name", "email", "phone", "lead_source"],
  },
};
