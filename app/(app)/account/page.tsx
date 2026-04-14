import { Suspense } from "react";
import { Container } from "@/components/ui/layout/containers";
import { AccountFormLayout } from "@/components/account/account-form-layout";
import { getCurrentUserFromDB } from "@/lib/server/auth/read/getCurrentUser";
import { SectionHeading } from "@/components/ui/layout/blocks";
import { ErrorBoundary } from "@/components/ui/feedback/error-boundary";
import { AccountSkeleton, AccountError } from "@/components/account/states";

async function AccountContent() {
  // Layout already ensures user exists via getCurrentUserFromDB()
  const user = await getCurrentUserFromDB();
  
  // TypeScript doesn't know layout guarantees user exists, so we assert it
  if (!user) throw new Error("User not found - should be caught by layout");

  return <AccountFormLayout user={user} />;
}

export default function AccountPage() {
  return (
    <Container
      as="section"
      spacing="stack"
      position="center"
      width="full"
      className="max-w-4xl @container"
    >
      <SectionHeading
        header="Account Settings"
        subheader="Manage your account information and security settings"
      />

      <ErrorBoundary fallbackRender={AccountError}>
        <Suspense fallback={<AccountSkeleton />}>
          <AccountContent />
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
}
