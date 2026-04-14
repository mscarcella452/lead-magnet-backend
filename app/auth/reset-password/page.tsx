import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { validateToken } from "@/lib/server/auth/read/validateToken";
import { APP_ROUTES } from "@/lib/server/constants";
import { buildInvalidTokenUrl } from "@/lib/server/auth/helpers";

// ==============================================
// Types
// ==============================================

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

// ==============================================
// Page
// ==============================================

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const [session, { token }] = await Promise.all([auth(), searchParams]);

  if (session) redirect(APP_ROUTES.DASHBOARD);

  if (!token) {
    redirect(
      buildInvalidTokenUrl({ type: "passwordReset", reason: "not_found" }),
    );
  }

  const result = await validateToken(token, "passwordReset");

  if (!result.valid) {
    redirect(
      buildInvalidTokenUrl({ type: "passwordReset", reason: result.reason }),
    );
  }

  return (
    <>
      <h1 className="sr-only">Reset Password</h1>
      <ResetPasswordForm token={token} />
    </>
  );
}
