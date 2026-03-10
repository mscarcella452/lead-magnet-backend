import { memo, useCallback } from "react";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/layout/separator";
import { Container } from "@/components/ui/layout/containers";
import { motion, AnimatePresence } from "motion/react";
import { BulkStatusDropdown } from "@/components/leads/status/bulk-status-dropdown";
import { BulkPriorityDropdown } from "@/components/leads/priority/bulk-priority-dropdown";
import { BulkExportButton } from "@/components/leads/export/bulk-export-button";
import { Card } from "@/components/ui/layout/card";
import { BulkDeleteLeadsButton } from "@/components/leads/delete/bulk-delete-leads-button";
import { Button } from "@/components/ui/controls";

// ====================================================
// Types
// ====================================================

export interface SelectionBarProps {
  selectedLeads: Set<string>;
  onClear: () => void;
  refetch: () => void;
}

// ====================================================
// SELECTION BAR
// Floating toolbar that appears when one or more leads
// are selected. Renders null when selectedCount is 0
// so callers can always keep it mounted.
// ====================================================

export const SelectionBar = memo(function SelectionBar({
  selectedLeads,
  refetch,
  onClear,
}: SelectionBarProps) {
  const totalSelectedLeads = selectedLeads.size;

  const leadLabel = `lead${totalSelectedLeads !== 1 ? "s" : ""}`;

  const handleDelete = useCallback(() => {
    refetch();
    onClear();
  }, [refetch, onClear]);

  return (
    <AnimatePresence mode="wait">
      {totalSelectedLeads > 0 && (
        <motion.div
          layout
          className="fixed top-20 max-w-2xl w-[90vw] left-1/2 -translate-x-1/2 flex items-center justify-center z-50"
          style={{ transformOrigin: "center" }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            size="sm"
            role="toolbar"
            variant="popover-blur"
            border
            className="flex @2xl:flex-row items-center shadow-xs. border-border!  "
            aria-label={`${totalSelectedLeads} ${leadLabel} selected`}
          >
            <span
              aria-live="polite"
              aria-atomic="true"
              className="shrink-0 text-lg @2xl:text-sm font-medium"
            >
              {totalSelectedLeads} {leadLabel}
            </span>

            <SelectionBarSeparator />

            <Container
              spacing="group"
              width="full"
              className="grid grid-cols-2 @2xl:grid-cols-4"
            >
              <BulkStatusDropdown
                selectedLeads={selectedLeads}
                onSuccess={refetch}
                className="@max-lg:h-control-h-sm"
              />
              <BulkPriorityDropdown
                selectedLeads={selectedLeads}
                onSuccess={refetch}
                className="@max-lg:h-control-h-sm"
              />
              <Container
                spacing="group"
                className="col-span-2 @max-2xl:mt-2 @max-2xl:flex-row @2xl:grid @2xl:grid-cols-2 justify-end"
              >
                <BulkExportButton
                  selectedLeads={selectedLeads}
                  className="@max-lg:h-control-h-sm"
                  intent="soft"
                />

                <BulkDeleteLeadsButton
                  selectedLeads={selectedLeads}
                  onConfirm={handleDelete}
                />
              </Container>
            </Container>

            <SelectionBarSeparator />

            <Button
              intent="ghost"
              size="xs"
              mode="iconOnly"
              onClick={onClear}
              aria-label="Clear selection"
              className="@max-2xl:absolute @max-2xl:top-2 @max-2xl:right-2 "
            >
              <X aria-hidden="true" />
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const SelectionBarSeparator = () => (
  <Separator
    orientation="vertical"
    className="h-4 @max-2xl:hidden"
    aria-hidden="true"
  />
);
