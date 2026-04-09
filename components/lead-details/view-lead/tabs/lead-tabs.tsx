"use client";

import { memo } from "react";
import { RefObject } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useTabsContext,
} from "@/components/ui/controls/tabs";
import { cn } from "@/lib/utils/classnames";
import { TAB_ITEMS } from "@/components/lead-details/view-lead/tabs/config";
import { NotesContextProvider } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import type { LeadWithRelations } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface LeadTabsProps {
  className?: string;
  children: React.ReactNode;
}

interface LeadTabsContentProps {
  lead: LeadWithRelations;
  contentRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

// ============================================================================
// LeadTabs
// Thin wrapper around Tabs that seeds the default tab from config.
// ============================================================================

export function LeadTabs({ className, children }: LeadTabsProps) {
  return (
    <Tabs
      defaultValue={TAB_ITEMS[0].value}
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

export const LeadTabsList = memo(function LeadTabsList({
  className,
}: {
  className?: string;
}) {
  const { activeTab } = useTabsContext();

  return (
    <TabsList
      className={cn("col-span-full h-fit gap-2 bg-transparent p-0", className)}
      role="tablist"
      aria-label="Lead detail sections"
    >
      {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
        <TabsTrigger
          key={value}
          value={value}
          isActive={activeTab === value}
          size="responsive-sm"
          intent="outline"
          aria-label={label}
          aria-selected={activeTab === value}
        >
          <Icon aria-hidden="true" />
          <span className="@max-lg:hidden">{label}</span>
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

export const LeadTabsContent = memo(function LeadTabsContent({
  lead,
  contentRef,
  className,
}: LeadTabsContentProps) {
  return (
    <NotesContextProvider
      initialNotes={lead.notes ?? []}
      leadId={lead.id}
      contentRef={contentRef}
    >
      <>
        {TAB_ITEMS.map(({ value, Component }) => (
          <TabsContent
            key={value}
            value={value}
            className={className}
            role="tabpanel"
            aria-label={value}
          >
            <Component lead={lead} />
          </TabsContent>
        ))}
      </>
    </NotesContextProvider>
  );
});
