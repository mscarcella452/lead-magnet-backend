import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function HomePage() {
  const authed = await checkAuth();
  if (authed) redirect("/dashboard");
  return <LoginForm />;
}
