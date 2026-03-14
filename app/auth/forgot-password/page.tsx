import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password",
  description: "Request a password reset",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
