"use client";

import { DialogClose } from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";
import { StatusBadge } from "@/components/leads/status";
import { ArrowLeftFromLine } from "lucide-react";
import { formatDate } from "@/lib/utils/dates";
import { LeadHeaderDropdown } from "@/components/lead-details/view-lead/header/header-dropdown";
import { LeadTabsList } from "@/components/lead-details/view-lead/tabs/lead-tabs";
import type { LeadWithRelations } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface LeadHeaderProps {
  lead: LeadWithRelations;
  onConfirm: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function LeadHeader({ lead, onConfirm }: LeadHeaderProps) {
  const leadTitle = lead.name ?? `#${lead.displayId}`;
  const formattedDate = formatDate(lead.createdAt);

  return (
    <Container spacing="content">
      <Container spacing="block" className="grid grid-cols-2 items-center">
        <Container
          spacing="item"
          className="flex flex-row items-center col-span-full"
        >
          <DialogClose className="static" size="responsive-sm">
            <ArrowLeftFromLine
              aria-hidden="true"
              className="text-base @lg:text-lg"
            />
          </DialogClose>

          <h2 className="mr-auto text-lg @lg:text-xl truncate">{leadTitle}</h2>

          <LeadHeaderDropdown lead={lead} onConfirm={onConfirm} />
        </Container>

        <StatusBadge
          status={lead.status}
          className="justify-self-start"
          aria-label={`Lead status: ${lead.status}`}
        />

        <span
          className="justify-self-end text-subtle-foreground text-xs @lg:text-sm"
          aria-label={`Created ${formattedDate}`}
        >
          {formattedDate}
        </span>
      </Container>
      <LeadTabsList />
    </Container>
  );
}
