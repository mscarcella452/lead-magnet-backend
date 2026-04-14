import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { ErrorBoundary } from "@/components/ui/feedback/error-boundary";
import { APP_ROUTES } from "@/lib/server/constants";
import { isAdminRole } from "@/lib/auth/rbac";
import { TeamError } from "@/components/admin/team/states/team-error";
import { TeamSkeleton } from "@/components/admin/team/states/team-skeleton";
import { TeamHeader } from "@/components/admin/team/team-header";
import { TeamSection } from "@/components/admin/team/team-section";
import { Container } from "@/components/ui/layout/containers";

export const metadata = {
  title: "Team Management",
  description: "Manage team members and permissions",
};

export default async function AdminTeamPage() {
  const user = await getCurrentUser();

  // Layout already ensures user exists, just check role authorization
  // Only OWNER or ADMIN role can access this page
  if (!user || !isAdminRole(user.role)) {
    redirect(APP_ROUTES.DASHBOARD);
  }

  return (
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
  );
}
