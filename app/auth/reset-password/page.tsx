import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password with a code",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
