import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/lib/server/constants";
import { SITE_CONFIG } from "@/config";
import { LoginForm } from "@/components/auth/login-form";
import { Inset } from "@/components/ui/layout/containers";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const [session, { from }] = await Promise.all([auth(), searchParams]);
  if (session) redirect(APP_ROUTES.DASHBOARD);
  const safeRedirect = from?.startsWith("/") ? from : APP_ROUTES.DASHBOARD;
  return (
    <Inset as="main" className="flex min-h-screen @container">
      <h1 className="sr-only">{SITE_CONFIG.business_name} Login</h1>
      <LoginForm defaultRedirect={safeRedirect} />
    </Inset>
  );
}
