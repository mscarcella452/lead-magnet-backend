import { UserRole } from "@prisma/client";

// ==============================================================================
// Team Form Types
// ==============================================================================

export type TeamMemberFieldKey = "name" | "email" | "confirmEmail" | "role";

export interface TeamMemberFormData {
  name: string;
  email: string;
  confirmEmail: string;
  role: UserRole | "";
}

export interface TeamMemberFormProps {
  id: string;
  formData: TeamMemberFormData;
  onChange: (data: TeamMemberFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}
