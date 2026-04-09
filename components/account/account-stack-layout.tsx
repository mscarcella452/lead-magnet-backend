"use client";
import { memo } from "react";

import { ACCOUNT_TAB_ITEMS } from "@/components/account/tabs/config";
import type { CurrentUser } from "@/lib/auth/auth-server-actions";

import { Container } from "@/components/ui/layout/containers";

interface AccountStackLayoutProps {
  user: CurrentUser;
  className?: string;
}

export const AccountStackLayout = memo(function AccountStackLayout({
  user,
  className,
}: AccountStackLayoutProps) {
  return (
    <Container spacing="content" className={className}>
      {ACCOUNT_TAB_ITEMS.map(({ value, Component }) => (
        <Component key={value} user={user} />
      ))}
    </Container>
  );
});
