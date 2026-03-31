"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button, ControlLabel } from "@/components/ui/controls";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/feedback/dialog";
import { DIALOG_TYPES } from "@/types/ui/dialog";

export const TeamHeader = () => {
  return (
    <DashboardHeader
      header="Team Management"
      subheader="Manage team members and their roles"
      action={
        <DialogTrigger dialogType={DIALOG_TYPES.CREATE_NEW_MEMBER} asChild>
          <Button size="sm" mode="responsiveIcon">
            <Plus aria-hidden="true" />
            <ControlLabel>Add Team Member</ControlLabel>
          </Button>
        </DialogTrigger>
      }
    />
  );
};
