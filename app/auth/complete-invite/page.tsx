import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { CompleteAccountForm } from "@/components/auth/complete-account-form";
import { validateToken } from "@/lib/server/auth/read/validateToken";
import { APP_ROUTES } from "@/lib/server/constants";
import { buildInvalidTokenUrl } from "@/lib/server/auth/helpers";

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
  const [user, { token }] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  if (user) redirect(APP_ROUTES.DASHBOARD);

  if (!token) {
    redirect(buildInvalidTokenUrl({ type: "invite", reason: "not_found" }));
  }

  const result = await validateToken(token, "invite");

  if (!result.valid) {
    redirect(buildInvalidTokenUrl({ type: "invite", reason: result.reason }));
  }

  return (
    <>
      <h1 className="sr-only">Set Up Your Account</h1>
      <CompleteAccountForm token={token} />
    </>
  );
}
