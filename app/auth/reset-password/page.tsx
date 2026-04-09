import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { InvalidLinkCard } from "@/components/auth/cards/invalid-link-card";
import { APP_ROUTES } from "@/lib/server/constants";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const [session, { token }] = await Promise.all([auth(), searchParams]);

  if (session) redirect(APP_ROUTES.DASHBOARD);
  if (!token) return <InvalidLinkCard />;

  return <ResetPasswordForm token={token} />;
}
