import { AccountRecoveryForm } from "@/components/auth/account-recovery-form";

export const metadata = {
  title: "Account Recovery",
  description: "Recover your username or reset your password.",
};

export default function AccountRecoveryPage() {
  return (
    <>
      <h1 className="sr-only">Account Recovery</h1>
      <AccountRecoveryForm />
    </>
  );
}
