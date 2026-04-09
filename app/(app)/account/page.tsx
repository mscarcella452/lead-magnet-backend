import { redirect } from "next/navigation";
import { Inset, Container } from "@/components/ui/layout/containers";
import { AccountFormLayout } from "@/components/account/account-form-layout";
import { AUTH_ROUTES } from "@/lib/server/constants";
import { getCurrentUserFromDB } from "@/lib/auth/auth-server-actions";
import { SectionHeading } from "@/components/ui/layout/blocks";

export default async function AccountPage() {
  const user = await getCurrentUserFromDB();

  if (!user) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  return (
    <Inset as="main" variant="content">
      <Container
        as="section"
        spacing="stack"
        position="center"
        width="full"
        // width="constrained"
        className="max-w-4xl @container"
      >
        <SectionHeading
          header="Account Settings"
          subheader="Manage your account information and security settings"
        />

        <AccountFormLayout user={user} />
      </Container>
    </Inset>
  );
}
