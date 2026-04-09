"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls";
import { Container, Inset } from "@/components/ui/layout/containers";
import { AuthCard } from "./auth-card";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/layout/card";
import { Alert } from "@/components/ui/feedback/alert";
import { MailIcon, AlertCircleIcon } from "lucide-react";

interface InvalidLinkCardProps {
  className?: string;
  title?: string;
  message?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export function InvalidLinkCard({
  className,
  title = "Invalid invite link",
  message = "This invite link is invalid or has expired.",
  buttonLabel = "Back to Login",
  buttonHref = "/",
}: InvalidLinkCardProps) {
  const router = useRouter();

  return (
    <Inset className="flex min-h-screen">
      <AuthCard description={title} className={cn("min-h-0", className)}>
        <Container spacing="block">
          <Alert variant="destructive">
            <Container
              spacing="item"
              className="flex flex-row items-center text-sm"
            >
              <AlertCircleIcon className="size-4" />
              <p>{message}</p>
            </Container>
          </Alert>
          <Button onClick={() => router.push(buttonHref)} className="w-full">
            {buttonLabel}
          </Button>
        </Container>
      </AuthCard>
    </Inset>
  );
}
