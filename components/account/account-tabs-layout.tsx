"use client";
import { memo } from "react";
import type { CurrentUser } from "@/lib/server/auth/read/getCurrentUser";
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
      <Container spacing="section" className="grid grid-cols-3">
        <AccountTabsList />
        <AccountTabsContent user={user} className="col-span-2" />
      </Container>
    </AccountTabs>
  );
});
