import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { APP_ROUTES } from "@/lib/server/constants";

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

  if (session) redirect(APP_ROUTES.DASHBOARD);

  const safeRedirect = from?.startsWith("/") ? from : APP_ROUTES.DASHBOARD;

  return <LoginForm defaultRedirect={safeRedirect} />;
}
