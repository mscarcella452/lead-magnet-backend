"use client";

import { Container } from "@/components/ui/layout/containers";
import { Badge } from "@/components/ui/feedback/badge";
import { AnimatePresence, motion } from "motion/react";

interface RelationsId {
  id: string | number;
}

interface RelationsHistoryProps<T extends RelationsId> {
  label: string;
  relations: T[];
  totalRelations: number;
  action?: React.ReactNode;
  shouldAnimate?: boolean;
  Item: React.FC<{ relation: T; shouldAnimate?: boolean }>;
}

function RelationsHistory<T extends RelationsId>({
  relations,
  totalRelations,
  label,
  action,
  shouldAnimate,
  Item,
}: RelationsHistoryProps<T>) {
  const lowerCaseLabel = label.toLowerCase();
  const isFiltered = relations.length < totalRelations;

  const hasRelations = relations.length > 0;

  return (
    <Container spacing="group" as="section">
      <Container spacing="item">
        <Container
          spacing="item"
          className="flex flex-row items-center relative h-control-h-sm"
        >
          <h3 className="text-sm @lg:text-base font-medium capitalize">
            {label}
          </h3>

          {hasRelations && (
            <Badge
              // variant="brand"
              intent="outline"
              size="sm"
              mode={totalRelations >= 100 ? "default" : "iconOnly"}
              radius="pill"
              className="text-muted-foreground!"
            >
              {totalRelations}
            </Badge>
          )}

          {action && <span className="ml-auto">{action}</span>}
        </Container>
        {isFiltered && (
          <p className="text-subtle-foreground text-xs">Most Recent</p>
        )}
        {!hasRelations && (
          <p className="text-sm text-muted-foreground italic">
            No {lowerCaseLabel} yet
          </p>
        )}
      </Container>

      {hasRelations && (
        <motion.div layout>
          <Container spacing="item" className="relative">
            {relations.map((relation) => (
              <Item
                key={relation.id}
                relation={relation}
                {...(shouldAnimate ? { shouldAnimate } : {})}
              />
            ))}
          </Container>
        </motion.div>
      )}
    </Container>
  );
}

export { RelationsHistory };
