import { Contact, UserIcon, ShieldIcon, type LucideIcon } from "lucide-react";
import { ProfileForm } from "@/components/account/form-components/profile-form";
import { EmailForm } from "@/components/account/form-components/email-form";
import { PasswordForm } from "@/components/account/form-components/password-form";
import type { CurrentUser } from "@/lib/auth/auth-server-actions";

import type { ComponentType } from "react";

// ============================================================================
// Types
// ============================================================================

export interface AccountTabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  Component: ComponentType<{
    user: CurrentUser;
  }>;
}

// ============================================================================
// Config
// ============================================================================

export const ACCOUNT_TAB_ITEMS: AccountTabItem[] = [
  {
    value: "profile",
    label: "Profile",
    icon: UserIcon,
    Component: ProfileForm,
  },
  {
    value: "email",
    label: "Email",
    icon: Contact,
    Component: EmailForm,
  },
  {
    value: "password",
    label: "Password",
    icon: ShieldIcon,
    Component: PasswordForm,
  },
];
