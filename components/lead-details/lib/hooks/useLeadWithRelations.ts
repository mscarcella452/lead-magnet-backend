import { useState, useEffect } from "react";
import { getLeadWithRelationsAction } from "@/lib/server/leads/actions/read/getLeadWithRelationsAction";
import { leadWithRelationsCache } from "@/lib/server/leads/cache";
import type { LeadWithRelations } from "@/types/leads/lead";

type LeadState =
  | { status: "loading" }
  | { status: "success"; lead: LeadWithRelations }
  | { status: "error"; error: string };

export function useLeadWithRelations(leadId: string) {
  const [leadState, setLeadState] = useState<LeadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const fetchLead = async () => {
      const cached = leadWithRelationsCache.get(leadId);
      if (cached) {
        setLeadState({ status: "success", lead: cached });
        return;
      }

      setLeadState({ status: "loading" });

      const result = await getLeadWithRelationsAction(leadId);
      if (cancelled) return;

      if (!result.success) {
        setLeadState({ status: "error", error: result.error });
        return;
      }

      leadWithRelationsCache.set(leadId, result.data);
      setLeadState({ status: "success", lead: result.data });
    };

    fetchLead();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  return leadState;
}
