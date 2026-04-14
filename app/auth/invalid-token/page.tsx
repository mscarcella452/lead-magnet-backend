import { InvalidTokenCard } from "@/components/auth/cards/invalid-token-card";
import { AUTH_ROUTES, APP_ROUTES } from "@/lib/server/constants";
import type { TokenType, TokenReason } from "@/types/auth";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";

// ============================================================
// Types
// ============================================================

interface InvalidTokenPageProps {
  searchParams: Promise<{
    reason?: TokenReason;
    type?: TokenType;
  }>;
}

// ============================================================
// Constants
// ============================================================

const TOKEN_ERROR_MESSAGES: Record<TokenType, Record<TokenReason, string>> = {
  invite: {
    not_found: "This invite link is invalid.",
    expired:
      "Your invite link has expired. Please ask your admin to resend your invite.",
  },
  passwordReset: {
    not_found: "This password reset link is invalid.",
    expired: "Your reset link has expired. Please request a new one.",
  },
  emailVerification: {
    not_found: "This verification link is invalid.",
    expired: "Your verification link has expired.",
  },
};

const FALLBACK_MESSAGE = "This link is invalid or has expired.";

// ============================================================
// Helpers
// ============================================================

const TOKEN_TITLES: Record<TokenType, string> = {
  invite: "Invalid Invite Link",
  passwordReset: "Invalid Reset Link",
  emailVerification: "Invalid Verification Link",
};

const getButtonContent = (
  type?: TokenType,
  reason?: TokenReason,
  isAuthenticated?: boolean,
): { href: string; label: string } => {
  if (type === "passwordReset" && reason === "expired")
    return { href: AUTH_ROUTES.ACCOUNT_RECOVERY, label: "Request New Link" };
  if (type === "emailVerification" && isAuthenticated)
    return { href: APP_ROUTES.ACCOUNT, label: "Back to Account" };
  return { href: AUTH_ROUTES.LOGIN, label: "Back to Login" };
};

const getInvalidTokenContent = (
  type?: TokenType,
  reason?: TokenReason,
  isAuthenticated?: boolean,
) => {
  const { href: buttonHref, label: buttonLabel } = getButtonContent(
    type,
    reason,
    isAuthenticated,
  );
  return {
    title: type ? TOKEN_TITLES[type] : "Invalid Link",
    message:
      type && reason
        ? (TOKEN_ERROR_MESSAGES[type]?.[reason] ?? FALLBACK_MESSAGE)
        : FALLBACK_MESSAGE,
    buttonHref,
    buttonLabel,
  };
};

// ============================================================
// InvalidTokenPage
// ============================================================

export default async function InvalidTokenPage({
  searchParams,
}: InvalidTokenPageProps) {
  const [user, { reason, type }] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  const { title, message, buttonHref, buttonLabel } = getInvalidTokenContent(
    type,
    reason,
    !!user,
  );

  return (
    <>
      <h1 className="sr-only">Invalid Link</h1>
      <InvalidTokenCard
        title={title}
        message={message}
        buttonLabel={buttonLabel}
        buttonHref={buttonHref}
      />
    </>
  );
}
