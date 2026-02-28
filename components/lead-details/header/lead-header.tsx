"use client";

import { Lead } from "@/types";
import { DialogClose, DialogTitle } from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";
import { ArrowLeftFromLine } from "lucide-react";
import { StatusBadge } from "@/components/status";

import { formatDate } from "@/lib/utils/dates";

import { LeadHeaderDropdown } from "@/components/lead-details/header/header-dropdown";

import { LeadTabsList } from "@/components/lead-details/tabs/lead-tabs";

const LeadHeader = ({ lead }: { lead: Lead }) => {
  const leadTitle = lead?.name || `#${lead?.displayId}`;

  const formattedDate = formatDate(lead.createdAt);
  return (
    <Container spacing="content">
      <Container spacing="block" className="grid grid-cols-2 items-center ">
        <Container
          spacing="item"
          className="flex flex-row items-center col-span-full "
        >
          <DialogClose className="static" size="responsive-sm">
            <ArrowLeftFromLine className="text-base @lg:text-lg" />
          </DialogClose>
          <DialogTitle className="mr-auto text-lg @lg:text-xl truncate">
            {leadTitle}
          </DialogTitle>

          <LeadHeaderDropdown lead={lead} />
        </Container>

        <StatusBadge
          status={lead.status ?? "NEW"}
          className="justify-self-start"
        />
        <span className="justify-self-end text-subtle-foreground text-xs @lg:text-sm">
          {formattedDate}
        </span>
      </Container>

      <LeadTabsList />
    </Container>
  );
};

export { LeadHeader };
