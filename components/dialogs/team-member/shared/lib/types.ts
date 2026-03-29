import { UserRole } from "@prisma/client";
import { TeamMemberFormData } from "@/types/ui/dialog";

// ============================================================
// Types
// ============================================================

export const ROLES: UserRole[] = [
  "ADMIN",
  "OWNER",
  "MARKETING",
  "SUPPORT",
  "SALES",
  "HR",
];

export interface TeamMemberFormRef {
  validate: () => boolean;
}

export interface TeamMemberFormProps {
  id: string;
  isOwner?: boolean;
  formData: TeamMemberFormData;
  onChange: (data: TeamMemberFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}
