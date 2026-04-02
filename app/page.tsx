import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

// ==============================================
// Types
// ==============================================

interface HomePageProps {
  searchParams: Promise<{ from?: string }>;
}

// ==============================================
// Page
// ==============================================

export default async function HomePage({ searchParams }: HomePageProps) {
  const [session, { from }] = await Promise.all([auth(), searchParams]);

  if (session) redirect("/dashboard");

  const safeRedirect = from?.startsWith("/") ? from : "/dashboard";

  return <LoginForm defaultRedirect={safeRedirect} />;
}
