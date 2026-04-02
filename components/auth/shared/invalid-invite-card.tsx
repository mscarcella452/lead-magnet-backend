"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls";
import { Container, Inset } from "@/components/ui/layout/containers";
import { AuthCard } from "./auth-card";

export function InvalidInviteCard() {
  const router = useRouter();

  return (
    <Inset className="flex min-h-screen">
      <AuthCard description="Invalid invite link" className="min-h-[350px]">
        <Container spacing="block">
          <p className="text-sm text-muted-foreground text-center">
            This invite link is invalid or has expired.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Back to Login
          </Button>
        </Container>
      </AuthCard>
    </Inset>
  );
}
