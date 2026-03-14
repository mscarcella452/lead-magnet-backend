import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return <LoginForm />;
}
