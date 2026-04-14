import type { TeamMemberFormData } from "./types";

// ==============================================================================
// Team Form Constants
// ==============================================================================

export const DEFAULT_FORM_DATA: TeamMemberFormData = {
  name: "",
  email: "",
  confirmEmail: "",
  role: "",
};

export const TEAM_MEMBER_ERROR_MESSAGES = {
  name: "Name is required.",
  email: "Email is required.",
  emailInvalid: "Please enter a valid email address.",
  emailMatch: "Emails do not match.",
  role: "Role is required.",
} as const;
