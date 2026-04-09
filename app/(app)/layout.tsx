import { AdminNav } from "@/components/navigation/AdminNav";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/server/constants";
import { isAdminRole } from "@/lib/auth/constants";
import { BfcacheGuard } from "@/components/auth/bfcache-guard";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(AUTH_ROUTES.LOGIN);
  }
  const isAdmin = isAdminRole(user.role);

  return (
    <div className="min-h-screen">
      {/* BfcacheGuard --> Prevents authenticated pages from being accessible after logout
       * via the browser's back/forward cache (bfcache). */}
      <BfcacheGuard />
      <AdminNav isAdmin={isAdmin} user={user} />
      {children}
    </div>
  );
}
