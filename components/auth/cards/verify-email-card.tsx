import { Container } from "@/components/ui/layout/containers";
import { AuthCard } from "./auth-card";
import { Loader2Icon } from "lucide-react";

// verifying-email-card.tsx - static, no client needed
export function VerifyEmailCard() {
  return (
    <AuthCard description="Email Verification" className="min-h-0">
      <Container spacing="item" className="text-center">
        <Loader2Icon className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Verifying your email address...</p>
      </Container>
    </AuthCard>
  );
}
