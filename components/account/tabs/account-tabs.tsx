"use client";

import { memo } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useTabsContext,
} from "@/components/ui/controls/tabs";
import { cn } from "@/lib/utils/classnames";
import { ACCOUNT_TAB_ITEMS } from "@/components/account/tabs/config";
import type { CurrentUser } from "@/lib/auth/auth-server-actions";

// ============================================================================
// Types
// ============================================================================

interface AccountTabsProps {
  className?: string;
  children: React.ReactNode;
}

interface AccountTabsContentProps {
  user: CurrentUser;
  className?: string;
}

// ============================================================================
// LeadTabs
// Thin wrapper around Tabs that seeds the default tab from config.
// ============================================================================

export function AccountTabs({ className, children }: AccountTabsProps) {
  return (
    <Tabs
      defaultValue={ACCOUNT_TAB_ITEMS[0].value}
      className={cn("relative w-full @container", className)}
    >
      {children}
    </Tabs>
  );
}

// ============================================================================
// LeadTabsList
// Reads activeTab from context — no props needed beyond optional className.
// ============================================================================

export const AccountTabsList = memo(function AccountTabsList() {
  const { activeTab } = useTabsContext();

  return (
    <TabsList
      variant="panel"
      size="xs"
      className="w-52 @3xl:w-56  h-fit shadow-xs "
      orientation="vertical"
      role="tablist"
      aria-label="Lead detail sections"
    >
      {ACCOUNT_TAB_ITEMS.map(({ value, label, icon: Icon }) => (
        <TabsTrigger
          key={value}
          value={value}
          isActive={activeTab === value}
          aria-label={label}
          aria-selected={activeTab === value}
          size="sm"
          intent="outline"
          className="justify-start border-border-soft!"
          activeClassName="justify-start"
        >
          <Icon aria-hidden="true" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
});

// ============================================================================
// LeadTabsContent
// Renders all tab panels — Radix handles show/hide via value matching,
// preserving state and scroll position between tab switches.
// ============================================================================

export const AccountTabsContent = memo(function AccountTabsContent({
  user,
  className,
}: AccountTabsContentProps) {
  return (
    <>
      {ACCOUNT_TAB_ITEMS.map(({ value, Component }) => (
        <TabsContent
          key={value}
          value={value}
          className={className}
          role="tabpanel"
          aria-label={value}
        >
          <Component user={user} />
        </TabsContent>
      ))}
    </>
  );
});
