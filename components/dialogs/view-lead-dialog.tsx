"use client";

import { Lead, LeadWithRelations } from "@/types";
import {
  DialogContent,
  DialogHeader,
  DialogBody,
} from "@/components/ui/feedback/dialog";
import { useRef, useEffect, useState } from "react";

import { LeadHeader } from "@/components/lead-details/header/lead-header";
import { cn } from "@/lib/utils/classnames";
import {
  LeadTabs,
  LeadTabsContent,
} from "@/components/lead-details/tabs/lead-tabs";
import { getLeadWithRelationsAction } from "@/lib/server/actions/read/getLeadWithRelationsAction";
import { leadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import {
  LeadHeaderSkeleton,
  LeadTabsSkeleton,
} from "@/components/lead-details/skeletons";

type ViewLeadState =
  | { status: "loading" }
  | { status: "success"; lead: LeadWithRelations }
  | { status: "error"; error: string };

export function ViewLeadDialog({ leadId }: { leadId: string }) {
  const viewLeadContentRef = useRef<HTMLDivElement>(null);
  const [leadState, setLeadState] = useState<ViewLeadState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchLead = async () => {
      setLeadState({ status: "loading" });

      const result = await getLeadWithRelationsAction(leadId);
      if (cancelled) return;

      if (!result.success) {
        setLeadState({ status: "error", error: result.error });
        return;
      }

      // Update cache defensively
      leadWithRelationsCache.set(leadId, {
        notes: result.data.notes,
        activities: result.data.activities,
      });

      setLeadState({ status: "success", lead: result.data });
    };

    fetchLead();

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const lead = leadState.status === "success" ? leadState.lead : null;

  return (
    <DialogContent
      variant="background"
      layout="drawer"
      enterFrom="right"
      rounded="none"
      spacing="none"
      border={false}
      contentClassName="relative"
      contentRef={viewLeadContentRef}
    >
      <LeadTabs>
        <DialogHeader
          className={cn(
            "sticky bg-background-blur border-b z-10 top-0",
            "px-dialog-x-md",
            "pt-dialog-y-md",
            "pb-dialog-y-sm",
          )}
        >
          {lead ? <LeadHeader lead={lead} /> : <LeadHeaderSkeleton />}
        </DialogHeader>

        <DialogBody
          className={cn("px-dialog-x-md", "pb-dialog-y-md", "pt-dialog-y-sm")}
        >
          {lead ? (
            <LeadTabsContent
              lead={lead}
              viewLeadContentRef={viewLeadContentRef}
            />
          ) : (
            <LeadTabsSkeleton />
          )}
        </DialogBody>
      </LeadTabs>
    </DialogContent>
  );
}
