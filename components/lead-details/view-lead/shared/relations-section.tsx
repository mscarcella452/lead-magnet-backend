"use client";

import { Container } from "@/components/ui/layout/containers";
import {
  LIST_INNER_MOTION_PROPS,
  LIST_OUTER_MOTION_PROPS,
} from "@/components/lead-details/view-lead/shared/list-motion-variants";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/feedback/badge";
import { cn } from "@/lib/utils";

interface RelationsSectionProps {
  label: string;
  totalRelations: number;
  isFiltered?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function RelationsSection({
  totalRelations,
  label,
  isFiltered,
  action,
  children,
}: RelationsSectionProps) {
  const lowerCaseLabel = label.toLowerCase();

  const hasRelations = totalRelations > 0;

  const subHeadline = isFiltered ? "Most Recent" : `No ${lowerCaseLabel} yet`;

  return (
    <Container spacing="group" as="section">
      <div>
        <Container
          spacing="item"
          className="flex flex-row items-center relative h-control-h-sm"
        >
          <h3 className="text-sm @lg:text-base font-medium capitalize">
            {label}
          </h3>

          <AnimatePresence initial={false}>
            {hasRelations && (
              <motion.div key="badge" {...LIST_OUTER_MOTION_PROPS}>
                <motion.div {...LIST_INNER_MOTION_PROPS}>
                  <Badge
                    variant="brand"
                    intent="soft"
                    size="sm"
                    mode={totalRelations >= 100 ? "default" : "iconOnly"}
                    radius="pill"
                  >
                    {totalRelations}
                  </Badge>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {action && <span className="ml-auto">{action}</span>}
        </Container>
        <AnimatePresence initial={false}>
          {(isFiltered || !hasRelations) && (
            <motion.p key="subHeadline" {...LIST_OUTER_MOTION_PROPS}>
              <motion.span
                {...LIST_INNER_MOTION_PROPS}
                className={cn("text-caption pt-1", {
                  italic: !isFiltered,
                })}
              >
                {subHeadline}
              </motion.span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {children}
    </Container>
  );
}
