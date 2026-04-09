import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CompleteAccountForm } from "@/components/auth/complete-account-form";
import { InvalidLinkCard } from "@/components/auth/cards/invalid-link-card";
import { APP_ROUTES } from "@/lib/server/constants";

// ==============================================
// Types
// ==============================================

interface CompleteInvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

// ==============================================
// Page
// ==============================================

export default async function CompleteInvitePage({
  searchParams,
}: CompleteInvitePageProps) {
  const [session, { token }] = await Promise.all([auth(), searchParams]);

  if (session) redirect(APP_ROUTES.DASHBOARD);
  if (!token) return <InvalidLinkCard />;

  return <CompleteAccountForm token={token} />;
}
