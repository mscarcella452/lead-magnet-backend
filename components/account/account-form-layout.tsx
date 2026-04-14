"use client";
import { memo } from "react";

import { AccountStackLayout } from "./account-stack-layout";
import { AccountTabsLayout } from "./account-tabs-layout";
import type { CurrentUser } from "@/lib/server/auth/read/getCurrentUser";

export const AccountFormLayout = memo(function AccountFormLayout({
  user,
}: {
  user: CurrentUser;
}) {
  return (
    <div className="@container/form-layout">
      <AccountTabsLayout className="@max-3xl/form-layout:hidden" user={user} />
      <AccountStackLayout className="@3xl/form-layout:hidden" user={user} />
    </div>
  );
});
