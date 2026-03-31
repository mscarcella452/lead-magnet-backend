import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { ErrorBoundary } from "@/components/ui/feedback/error-boundary";
import { REVALIDATE_PATHS } from "@/lib/server/constants";
import { isAdminRole } from "@/lib/auth/constants";
import { TeamError } from "@/components/admin/team/states/team-error";
import { TeamSkeleton } from "@/components/admin/team/states/team-skeleton";
import { TeamHeader } from "@/components/admin/team/team-header";
import { TeamSection } from "@/components/admin/team/team-section";
import { Inset, Container } from "@/components/ui/layout/containers";

export const metadata = {
  title: "Team Management",
  description: "Manage team members and permissions",
};

export default async function AdminTeamPage() {
  const session = await auth();

  // Only OWNER or ADMIN role can access this page
  if (!session?.user || !isAdminRole(session.user.role)) {
    redirect(REVALIDATE_PATHS.ADMIN_DASHBOARD);
  }

  return (
    <Inset as="main" variant="content">
      <Container as="section" spacing="section" width="constrained">
        <Container spacing="content" position="start" width="full">
          <TeamHeader />
          <ErrorBoundary fallbackRender={TeamError}>
            <Suspense fallback={<TeamSkeleton />}>
              <TeamSection />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </Container>
    </Inset>
  );
}
