"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/layout/containers";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/layout/table";
import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { TeamTableRow } from "@/components/admin/team/table/team-table-row";
import { Checkbox } from "@/components/ui/controls/checkbox";
import { memo, useCallback, useState } from "react";

import { X } from "lucide-react";
import { Separator } from "@/components/ui/layout/separator";
import { motion, AnimatePresence } from "motion/react";
import { BulkStatusDropdown } from "@/components/leads/status/bulk-status-dropdown";
import { BulkPriorityDropdown } from "@/components/leads/priority/bulk-priority-dropdown";
import { BulkExportButton } from "@/components/leads/export/bulk-export-button";
import { Card } from "@/components/ui/layout/card";
import { BulkDeleteLeadsButton } from "@/components/leads/delete/bulk-delete-leads-button";
import { Button, ControlLabel } from "@/components/ui/controls";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================
// types
// ============================================================

interface TeamTableProps {
  initialMembers: TeamMember[];
}

// ============================================================
// Constants
// ============================================================

const TABLE_HEADERS = [
  "Name",
  "Role",
  // "Email",
  "Status",
] as const;

// ============================================================
// Team Table
// ============================================================

export function TeamTable({ initialMembers }: TeamTableProps) {
  return (
    <Table role="region" aria-label="Team table" className="@5xl:table-fixed">
      <TableHeader>
        <TableRow hoverable={false}>
          {TABLE_HEADERS.map((header) => (
            <TableHead key={header} scope="col">
              {header}
            </TableHead>
          ))}
          <TableHead scope="col" className="w-48">
            Created
          </TableHead>
          <TableHead scope="col" className="w-24">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialMembers.map((member) => (
          <TeamTableRow key={member.id} member={member} />
        ))}
      </TableBody>
    </Table>
  );
}
