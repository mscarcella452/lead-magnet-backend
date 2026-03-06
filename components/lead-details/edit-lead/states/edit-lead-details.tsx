// import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { type LeadWithRelations } from "@/types";
import { type LeadMetadata } from "@/types/lead-fields";
import { type LeadMagnetType } from "@/types/lead-magnets";
import { groupFieldsBySection } from "@/lib/utils/lead-magnets";
import {
  buildEditSections,
  diffFormState,
  diffToUpdateData,
  resolveInitialValues,
} from "@/components/lead-details/edit-lead/lib/helpers";
import { type EditFormState } from "@/components/lead-details/edit-lead/lib/types";
import {
  EditSectionBlock,
  EditSummaryBlock,
} from "@/components/lead-details/edit-lead/shared/edit-components";
import { Button } from "@/components/ui/controls/button";
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { updateLeadAction } from "@/lib/server/actions/write/updateLeadAction";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import {
  EditLeadHeader,
  EditLeadBody,
  EditLeadFooter,
} from "@/components/lead-details/edit-lead/shared/edit-lead-shell";

// ============================================================================
// Types
// ============================================================================

interface EditLeadDetailsProps {
  lead: LeadWithRelations;
  onLeadUpdated: () => void;
}

// ============================================================================
// Hooks
// ============================================================================

function useEditLeadForm(lead: LeadWithRelations) {
  const metadata = (lead.metadata as LeadMetadata) ?? {};
  const magnetType = lead.leadMagnet?.name as LeadMagnetType | undefined;
  const grouped = groupFieldsBySection(magnetType);
  const sections = buildEditSections(lead, metadata, grouped);
  const initialValues = resolveInitialValues(lead, metadata, grouped);

  const [formState, setFormState] = useState<EditFormState>(initialValues);

  const handleChange = useCallback((key: string, value: string | null) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { formState, sections, initialValues, handleChange };
}

// ============================================================================
// Component
// ============================================================================

export function EditLeadDetails({ lead, onLeadUpdated }: EditLeadDetailsProps) {
  const { closeDialog } = useDialogs();
  const { formState, sections, initialValues, handleChange } =
    useEditLeadForm(lead);
  // console.log(lead, formState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const diff = diffFormState(initialValues, formState);

    if (Object.keys(diff).length === 0) {
      closeDialog();
      return;
    }

    setIsSubmitting(true);

    const result = await updateLeadAction(
      lead.id,
      diffToUpdateData(diff),
      "You",
    );

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Lead updated successfully");
      invalidateLeadWithRelationsCache(lead.id);
      onLeadUpdated();
      closeDialog();
    } else {
      toast.error(result.error);
    }
  }, [formState, initialValues, lead.id, closeDialog, onLeadUpdated]);

  return (
    <>
      <EditLeadHeader>
        <span id="edit-lead-title" className="text-lg @lg:text-xl">
          Edit Lead
        </span>
        <span
          aria-live="polite"
          className="text-subtle-foreground truncate max-w-64"
        >
          {formState.name ?? `#${lead.displayId}`}
        </span>
      </EditLeadHeader>

      <EditLeadBody>
        <EditSummaryBlock lead={lead} onChange={handleChange} />
        {sections.map(({ section, label, items }) => (
          <EditSectionBlock
            key={section}
            section={section}
            label={label}
            items={items}
            formState={formState}
            onChange={handleChange}
          />
        ))}
      </EditLeadBody>

      <EditLeadFooter>
        <Button
          type="button"
          intent="outline"
          size="sm"
          onClick={closeDialog}
          disabled={isSubmitting}
          className="@max-lg:h-11"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="@max-lg:h-11"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </EditLeadFooter>
    </>
  );
}
