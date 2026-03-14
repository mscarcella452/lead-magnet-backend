import { Suspense } from "react";
import { SetPasswordForm } from "@/components/auth/set-password-form";

export const metadata = {
  title: "Set Password",
  description: "Set your password to activate your account",
};

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}
