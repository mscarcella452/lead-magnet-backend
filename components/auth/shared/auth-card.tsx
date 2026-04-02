"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps,
} from "@/components/ui/layout/card";
import { Container } from "@/components/ui/layout/containers";
import { SITE_CONFIG } from "@/config";
import { LogoAvatar } from "@/components/brand/logo-avatar";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ==============================================
// Types
// ==============================================

export interface AuthCardProps extends CardProps {
  children: React.ReactNode;
  description?: string;
}

// ==============================================
// Component
// ==============================================

export function AuthCard({ children, description, ...props }: AuthCardProps) {
  const { className, ...cardProps } = props;

  return (
    <Card
      size="md"
      variant="panel"
      border
      className={cn(
        " w-full max-w-md m-auto min-h-[325px] flex items-center justify-center",
        className,
      )}
      {...cardProps}
    >
      <motion.div layout className="w-full">
        <Container spacing="block">
          {/* ── Header ── */}
          <CardHeader>
            <Container spacing="group" className="items-center">
              <LogoAvatar size="lg" className="@sm:size-12!" />
              <Container spacing="none" className="text-center gap-1">
                <CardTitle className="text-2xl font-semibold">
                  {SITE_CONFIG.business_name}
                </CardTitle>
                {description && (
                  <CardDescription className="text-subtle-foreground">
                    {description}
                  </CardDescription>
                )}
              </Container>
            </Container>
          </CardHeader>

          {/* ── Content ── */}
          <CardContent className="w-full">{children}</CardContent>
        </Container>
      </motion.div>
    </Card>
  );
}
