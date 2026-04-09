// ===========================================================
// Lead Info Sections
// Defines the display sections used to group fields
// in the lead info view.
// ===========================================================
export type LeadInfoSection =
  | "SUMMARY"
  | "CONTACT"
  | "BUSINESS"
  | "PREFERENCES"
  | "SOURCE";

// ===========================================================
// Lead Field Types
// Defines the input type for each field.
// Drives form rendering and validation.
// ===========================================================
export type LeadFieldType =
  | "text"
  | "email"
  | "phone"
  | "url"
  | "textarea"
  | "select";

// ===========================================================
// Lead Field Keys
// Defines all possible field identifiers across
// all lead magnets in this app.
// ===========================================================
export type LeadFieldKey =
  | "email"
  | "name"
  | "phone"
  | "location"
  | "company"
  | "job_title"
  | "website"
  | "lead_source"
  | "campaign"
  | "created_by"
  | "status"
  | "priority"
  | "fitness_goal"
  | "dietary_restrictions"
  | "preferred_trainer"
  | "membership_type";

// ===========================================================
// Lead Field Meta
// The shape of each entry in the registry.
// ===========================================================
export type LeadFieldMeta = {
  label: string;
  section: LeadInfoSection;
  order: number;
  fieldType: LeadFieldType;
  options?: readonly string[]; // only for "select" fields
  isDbColumn?: boolean; // true if stored as top-level DB column, not in metadata
};

// ===========================================================
// Lead Field Registry
// Single source of truth for every field's label,
// section, and display order. Any field used in a
// lead magnet definition must exist here.
// ===========================================================
export const LEAD_FIELD_REGISTRY: Record<LeadFieldKey, LeadFieldMeta> = {
  name: {
    label: "Name",
    section: "CONTACT",
    order: 1,
    fieldType: "text",
    isDbColumn: true,
  },
  email: {
    label: "Email",
    section: "CONTACT",
    order: 2,
    fieldType: "email",
    isDbColumn: true,
  },
  phone: { label: "Phone", section: "CONTACT", order: 3, fieldType: "phone" },
  location: {
    label: "Location",
    section: "CONTACT",
    order: 4,
    fieldType: "text",
  },
  company: {
    label: "Company",
    section: "BUSINESS",
    order: 1,
    fieldType: "text",
  },
  job_title: {
    label: "Job Title",
    section: "BUSINESS",
    order: 2,
    fieldType: "text",
  },
  website: {
    label: "Website",
    section: "BUSINESS",
    order: 3,
    fieldType: "url",
  },
  lead_source: {
    label: "Source",
    section: "SOURCE",
    order: 1,
    fieldType: "text",
    isDbColumn: true,
  },
  campaign: {
    label: "Campaign",
    section: "SOURCE",
    order: 2,
    fieldType: "text",
    isDbColumn: true,
  },
  created_by: {
    label: "Created By",
    section: "SOURCE",
    order: 3,
    fieldType: "text",
  },
  status: {
    label: "Status",
    section: "SUMMARY",
    order: 1,
    fieldType: "text",
    isDbColumn: true,
  },
  priority: {
    label: "Priority",
    section: "SUMMARY",
    order: 2,
    fieldType: "text",
    isDbColumn: true,
  },
  fitness_goal: {
    label: "Fitness Goal",
    section: "PREFERENCES",
    order: 1,
    fieldType: "select",
    options: [
      "Weight Loss",
      "Muscle Gain",
      "Improve Endurance",
      "Flexibility",
      "General Fitness",
      "Athletic Performance",
    ],
  },
  dietary_restrictions: {
    label: "Dietary Restrictions",
    section: "PREFERENCES",
    order: 2,
    fieldType: "select",
    options: [
      "None",
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Dairy-Free",
      "Keto",
      "Halal",
    ],
  },
  preferred_trainer: {
    label: "Preferred Trainer",
    section: "PREFERENCES",
    order: 3,
    fieldType: "text",
  },
  membership_type: {
    label: "Membership Type",
    section: "PREFERENCES",
    order: 4,
    fieldType: "select",
    options: ["Monthly", "Quarterly", "Annual", "Student", "Family"],
  },
};

// ===========================================================
// DB Lead Columns
// Fields that are stored as top-level columns on the Lead
// model rather than inside the metadata Json field.
// Used to exclude them from metadata generation.
// ===========================================================
export const DB_LEAD_COLUMNS = new Set<LeadFieldKey>([
  "name",
  "email",
  "lead_source",
  "campaign",
  "status",
  "priority",
]);

// ===========================================================
// Lead Metadata
// The shape of the metadata Json field on the Lead model.
// Only fields not in DB_LEAD_COLUMNS are stored here.
// Cast lead.metadata as LeadMetadata when reading from Prisma.
// ===========================================================
export type LeadMetadata = Partial<Record<LeadFieldKey, string>>;

// Metadata updates allow null values for clearing fields
export type LeadMetadataUpdate = Partial<Record<LeadFieldKey, string | null>>;
