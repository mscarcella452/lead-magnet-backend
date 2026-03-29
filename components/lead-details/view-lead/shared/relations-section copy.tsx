"use client";

import { Container } from "@/components/ui/layout/containers";
import { Badge } from "@/components/ui/feedback/badge";
import {
  LIST_INNER_MOTION_PROPS,
  LIST_OUTER_MOTION_PROPS,
} from "@/components/lead-details/view-lead/shared/list-motion-variants";
import { AnimatePresence, motion } from "motion/react";

interface RelationsId {
  id: string | number;
}

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
    <Container spacing="item" as="section">
      <Container spacing="item">
        <Container
          spacing="item"
          className="flex flex-row items-center relative h-control-h-sm"
        >
          <h3 className="text-sm @lg:text-base font-medium capitalize">
            {label}
          </h3>

          {hasRelations && (
            <motion.div key="no-relations-yet" {...LIST_OUTER_MOTION_PROPS}>
              <motion.div {...LIST_INNER_MOTION_PROPS}>
                <Badge
                  variant="brand"
                  intent="soft"
                  size="sm"
                  mode={totalRelations >= 100 ? "default" : "iconOnly"}
                  radius="pill"
                  className="text-muted-foreground!"
                >
                  {totalRelations}
                </Badge>
              </motion.div>
            </motion.div>
          )}

          {action && <span className="ml-auto">{action}</span>}
        </Container>
        {/* <AnimatePresence initial={false}>
          {(isFiltered || !hasRelations) && (
            <motion.p key="no-relations-yet" {...LIST_OUTER_MOTION_PROPS}>
              <motion.span
                {...LIST_INNER_MOTION_PROPS}
                className="text-sm text-muted-foreground italic"
              >
                {subHeadline}
              </motion.span>
            </motion.p>
          )}
        </AnimatePresence> */}
        {/* {isFiltered && (
          <p className="text-subtle-foreground text-xs">Most Recent</p>
        )}
        {!hasRelations && (
          <p className="text-sm text-muted-foreground italic">
            No {lowerCaseLabel} yet
          </p>
        )} */}
      </Container>

      {children}
    </Container>
  );
}
