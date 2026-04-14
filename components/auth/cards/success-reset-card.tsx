"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { AuthCard } from "./auth-card";
import { AUTH_ROUTES } from "@/lib/server/constants";
import { formatExpiry } from "@/lib/utils";
import { EXPIRY_MS } from "@/lib/server/constants";

// ==============================================
// Types
// ==============================================

interface SuccessResetCardProps {
  sentEmail: string;
  setSentEmail: (value: string) => void;
}

// ==============================================
// SuccessResetCard
// ==============================================

export const SuccessResetCard = ({
  sentEmail,
  setSentEmail,
}: SuccessResetCardProps) => {
  const router = useRouter();

  const handleResend = () => setSentEmail("");

  const handleBackToLogin = () => router.push(AUTH_ROUTES.LOGIN);

  const expiryDuration = formatExpiry(
    new Date(Date.now() + EXPIRY_MS.passwordReset),
  );

  return (
    <AuthCard description="">
      <Container spacing="block" className="text-center">
        <Container spacing="item" className="text-sm text-muted-foreground">
          <p>
            We sent a reset link to{" "}
            <span className="text-foreground font-medium">{sentEmail}</span>.
          </p>
          <p>It expires in {expiryDuration}.</p>
        </Container>
        <Container spacing="group">
          <Button intent="solid" onClick={handleResend}>
            Resend link
          </Button>
          <Button intent="ghost-text" onClick={handleBackToLogin}>
            Back to Login
          </Button>
        </Container>
      </Container>
    </AuthCard>
  );
};
