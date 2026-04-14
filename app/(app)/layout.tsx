import { AdminNav } from "@/components/navigation/AdminNav";
import { getCurrentUserFromDB } from "@/lib/server/auth/read/getCurrentUser";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/server/constants";
import { isAdminRole } from "@/lib/auth/rbac";
import { BfcacheGuard } from "@/components/auth/bfcache-guard";
import { Inset } from "@/components/ui/layout/containers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserFromDB();

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
      <Inset as="main" variant="content">
        {children}
      </Inset>
    </div>
  );
}
