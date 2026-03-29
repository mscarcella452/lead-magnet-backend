import { SITE_CONFIG } from "@/config";
import { TeamMemberFormData } from "@/types/ui/dialog";

// ============================================================
// Constants
// ============================================================

export const DEFAULT_NAME = "Jamie Smith";

export const DEFAULT_EMAIL = `${DEFAULT_NAME.toLowerCase().replace(/\s+/g, ".")}@${new URL(SITE_CONFIG.domain).hostname}`;

export const DEFAULT_FORM_DATA: TeamMemberFormData = {
  name: "",
  email: "",
  role: "",
};
