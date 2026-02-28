"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useTabsContext,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils/classnames";
import { ControlLabel } from "@/components/ui/controls";
import { TAB_ITEMS } from "@/components/lead-details/tabs/config";
import { Lead, LeadRelations } from "@/types";
import { AnimatePresence, motion } from "motion/react";

// ==========================================================================
// Types
// ==========================================================================

interface LeadTabsProps {
  className?: string;
  children: React.ReactNode;
}

interface LeadTabsContentProps {
  lead: Lead;
  relationsData: LeadRelations;
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
 * Renders all tab panels upfront — Radix handles show/hide via value matching.
 * This preserves component state and scroll position between tab switches,
 * and ensures correct aria-labelledby / role="tabpanel" on each panel.
 *
 * lead and relationsData are merged once here to avoid re-merging per panel.
 */
// ==========================================================================

export const LeadTabsContent = ({
  lead,
  relationsData,
  className,
}: LeadTabsContentProps & { className?: string }) => {
  // Memoized so the spread doesn't produce a new object on every render
  const mergedLead = React.useMemo(
    () => ({ ...lead, ...relationsData }),
    [lead, relationsData],
  );

  return (
    <>
      {TAB_ITEMS.map(({ value, Component }) => (
        <TabsContent key={value} value={value} className={className}>
          <Component lead={mergedLead} />
        </TabsContent>
      ))}
    </>
  );
};
