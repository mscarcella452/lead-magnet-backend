"use client";

import React, { RefObject, useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useTabsContext,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils/classnames";
import { TAB_ITEMS } from "@/components/lead-details/tabs/config";
import { LeadWithRelations } from "@/types";
import { CARD_MOTION_TRANSITION } from "../relations/notes/lib/constants";
import { NotesContextProvider } from "@/components/lead-details/relations/notes/providers/notes-context-provider";

// ==========================================================================
// Types
// ==========================================================================

interface LeadTabsProps {
  className?: string;
  children: React.ReactNode;
}

interface LeadTabsContentProps {
  lead: LeadWithRelations;
  viewLeadContentRef: RefObject<HTMLDivElement>;
}

// ==========================================================================
// LeadTabs
/**
 * Thin wrapper around <Tabs> that seeds the default tab from config.
 * activeTab state and context are managed inside <Tabs> itself.
 */
// ==========================================================================

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

// ==========================================================================
// LeadTabsList
/**
 * Reads activeTab from context to derive isActive per trigger.
 * Icons and labels come from TAB_ITEMS config — no props needed.
 */
// ==========================================================================

export const LeadTabsList = ({ className }: { className?: string }) => {
  const { activeTab } = useTabsContext();

  return (
    <TabsList
      className={cn("col-span-full h-fit gap-2 bg-transparent p-0", className)}
    >
      {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
        <TabsTrigger
          key={value}
          value={value}
          isActive={activeTab === value}
          size="responsive-sm"
          ariaLabel={label}
        >
          <Icon aria-hidden="true" />
          <span className="@max-lg:hidden">{label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

// ==========================================================================
// LeadTabsContent
/**
 * Renders all tab panels with the full lead data (including relations).
 * Relations are already fetched at the parent level (ViewLeadDialog).
 * Radix handles show/hide via value matching, preserving state and scroll
 * position between tab switches.
 */
// ==========================================================================

export const LeadTabsContent = React.memo(
  ({
    lead,
    viewLeadContentRef,
    className,
  }: LeadTabsContentProps & { className?: string }) => {
    return (
      <NotesContextProvider
        initialNotes={lead.notes || []}
        leadId={lead.id}
        viewLeadContentRef={viewLeadContentRef}
      >
        <>
          {TAB_ITEMS.map(({ value, Component }) => (
            <TabsContent key={value} value={value} className={className}>
              <Component lead={lead} />
            </TabsContent>
          ))}
        </>
      </NotesContextProvider>
    );
  },
);

LeadTabsContent.displayName = "LeadTabsContent";
