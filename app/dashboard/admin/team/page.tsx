import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getTeamMembers } from "@/lib/server/read/getTeamMembers";
import { TeamTable } from "@/components/admin/team/table/team-table";
import { ErrorBoundary } from "@/components/ui/feedback/error-boundary";
import { REVALIDATE_PATHS } from "@/lib/server/constants";
import { TeamError } from "@/components/admin/team/states/team-error";
import { TeamSkeleton } from "@/components/admin/team/states/team-skeleton";
import { TeamHeader } from "@/components/admin/team/team-header";
import { Inset, Container } from "@/components/ui/layout/containers";

export const metadata = {
  title: "Team Management",
  description: "Manage team members and permissions",
};

async function TeamMembersContent() {
  const members = await getTeamMembers();

  return <TeamTable initialMembers={members} />;
}

export default async function AdminTeamPage() {
  const session = await auth();

  const allowedRoles = ["ADMIN", "OWNER"];

  // Only ADMIN role can access this page
  if (!session || !allowedRoles.includes(session.user?.role)) {
    redirect(REVALIDATE_PATHS.ADMIN_DASHBOARD);
  }

  return (
    <Inset as="main" variant="content">
      <Container as="section" spacing="section" width="constrained">
        <Container spacing="content" position="start" width="full">
          <TeamHeader />

          <ErrorBoundary fallbackRender={TeamError}>
            <Suspense fallback={<TeamSkeleton />}>
              <TeamMembersContent />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </Container>
    </Inset>
  );
}
