import { AdminNav } from "@/components/navigation/AdminNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminNav />
      {children}
    </div>
  );
}
