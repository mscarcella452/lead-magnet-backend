import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { InvalidInviteCard } from "@/components/auth/shared/invalid-invite-card";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const [session, { token }] = await Promise.all([auth(), searchParams]);

  if (session) redirect("/dashboard");
  if (!token) return <InvalidInviteCard />;

  return <ResetPasswordForm token={token} />;
}
