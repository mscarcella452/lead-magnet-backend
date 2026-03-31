import { AdminNav } from "@/components/navigation/AdminNav";
import { isCurrentUserAdmin } from "@/lib/auth-helpers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isCurrentUserAdmin();

  return (
    <div className="min-h-screen">
      <AdminNav isAdmin={isAdmin} />
      {children}
    </div>
  );
}
