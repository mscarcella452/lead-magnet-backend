import { VerifyEmailCard } from "@/components/auth/cards/verify-email-card";
import { verifyEmailChange } from "@/lib/server/auth/write/verifyEmailChange";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { APP_ROUTES } from "@/lib/server/constants";
import {
  buildAccountUrl,
  buildInvalidTokenUrl,
} from "@/lib/server/auth/helpers";
import { validateToken } from "@/lib/server/auth/read/validateToken";

// ==============================================
// Types
// ==============================================

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

interface VerifyEmailProps {
  token: string;
}

// ==============================================
// Page
// ==============================================

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect(
      buildInvalidTokenUrl({ type: "emailVerification", reason: "not_found" }),
    );
  }

  const result = await validateToken(token, "emailVerification");

  if (!result.valid) {
    redirect(
      buildInvalidTokenUrl({
        type: "emailVerification",
        reason: result.reason,
      }),
    );
  }

  return (
    <Suspense
      fallback={
        <>
          <h1 className="sr-only">Verify Email</h1>
          <VerifyEmailCard />
        </>
      }
    >
      <VerifyEmail token={token} />
    </Suspense>
  );
}

// ==============================================
// VerifyEmail
// ==============================================

async function VerifyEmail({ token }: VerifyEmailProps) {
  try {
    await verifyEmailChange(token);
    revalidatePath(APP_ROUTES.ACCOUNT);
    redirect(buildAccountUrl({ emailVerified: true }));
  } catch (e) {
    if (isRedirectError(e)) throw e;
    // If verification fails for any reason, redirect to invalid token page
    redirect(
      buildInvalidTokenUrl({ type: "emailVerification", reason: "not_found" }),
    );
  }

  return null; // Never reached - both paths redirect
}
