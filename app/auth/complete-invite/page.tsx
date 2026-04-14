import { redirect } from "next/navigation";
import { auth } from "@/auth";
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
  const [session, { token }] = await Promise.all([auth(), searchParams]);

  if (session) redirect(APP_ROUTES.DASHBOARD);

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
