// ==============================================
// app/set-password/page.tsx
// ==============================================

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CompleteAccountForm } from "@/components/auth/complete-account-form";
import { InvalidInviteCard } from "@/components/auth/shared/invalid-invite-card";

// ==============================================
// Types
// ==============================================

interface SetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

// ==============================================
// Page
// ==============================================

export default async function SetPasswordPage({
  searchParams,
}: SetPasswordPageProps) {
  const [session, { token }] = await Promise.all([auth(), searchParams]);

  if (session) redirect("/dashboard");
  if (!token) return <InvalidInviteCard />;

  return <CompleteAccountForm token={token} />;
}
