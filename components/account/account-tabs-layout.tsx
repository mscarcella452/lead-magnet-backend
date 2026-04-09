"use client";
import { memo } from "react";
import type { CurrentUser } from "@/lib/auth/auth-server-actions";
import {
  AccountTabs,
  AccountTabsList,
  AccountTabsContent,
} from "./tabs/account-tabs";
import { Container } from "@/components/ui/layout/containers";

interface AccountTabsLayoutProps {
  user: CurrentUser;
  className?: string;
}

export const AccountTabsLayout = memo(function AccountTabsLayout({
  user,
  className,
}: AccountTabsLayoutProps) {
  return (
    <AccountTabs className={className}>
      <Container spacing="section" className="flex flex-row">
        <AccountTabsList />

        <AccountTabsContent user={user} className="flex-1" />
      </Container>
    </AccountTabs>
  );
});
