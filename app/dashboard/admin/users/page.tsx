import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UsersManagementPage } from "@/components/admin/users-management-page";

export const metadata = {
  title: "User Management",
  description: "Manage team members and permissions",
};

export default async function AdminUsersPage() {
  const session = await auth();

  // Only ADMIN role can access this page
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <UsersManagementPage />;
}
