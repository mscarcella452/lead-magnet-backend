import { VerifyEmailCard } from "@/components/auth/cards/verify-email-card";
import { InvalidLinkCard } from "@/components/auth/cards/invalid-link-card";
import {
  verifyEmailChange,
  getVerifyEmailError,
} from "@/lib/server/auth/write/verifyEmailChange";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth } from "@/auth";
import {
  APP_ROUTES,
  AUTH_ROUTES,
  buildAccountUrl,
} from "@/lib/server/constants";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

type sharedProps = {
  title: string;
  buttonLabel: string;
  buttonHref: string;
};

interface VerifyEmailProps extends sharedProps {
  token: string;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const session = await auth();
  const buttonHref = session ? APP_ROUTES.ACCOUNT : AUTH_ROUTES.LOGIN;
  const buttonLabel = session ? "Back to Account" : "Back to Login";

  const sharedProps: sharedProps = {
    title: "Email verification failed",
    buttonLabel,
    buttonHref,
  };

  if (!token)
    return (
      <InvalidLinkCard
        message="This verification link is invalid or has expired."
        {...sharedProps}
      />
    );

  return (
    <Suspense fallback={<VerifyEmailCard />}>
      <VerifyEmail token={token} {...sharedProps} />
    </Suspense>
  );
}

async function VerifyEmail({ token, ...sharedProps }: VerifyEmailProps) {
  try {
    await verifyEmailChange(token);
    revalidatePath(APP_ROUTES.ACCOUNT);
    redirect(buildAccountUrl({ emailVerified: true }));
  } catch (e) {
    if (isRedirectError(e)) throw e;
    const errorMessage = getVerifyEmailError(e);
    return <InvalidLinkCard message={errorMessage} {...sharedProps} />;
  }
}
