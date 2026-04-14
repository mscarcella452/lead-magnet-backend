import { Container } from "@/components/ui/layout/containers";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/layout/item";
import { Badge } from "@/components/ui/feedback/badge";
import { Link, ControlLabel } from "@/components/ui/controls";
import { Separator } from "@/components/ui/layout/separator";
import { cn } from "@/lib/utils/index";
import {
  type ContactAction,
  type InfoRowProps,
  type SummaryRowProps,
} from "@/components/lead-details/view-lead/info/lib/types";
import { hasAnyValue } from "@/components/lead-details/lib/helpers";
import { PriorityBadge } from "@/components/field-controls/priority";
import { LeadPriority } from "@prisma/client";

// ====================================================
// InfoSection
// ====================================================

/**
 * Labeled section wrapper used throughout the lead detail view.
 *
 * Generates a stable `id` from `title` and wires it to the section's
 * `aria-labelledby`, so screen readers announce the heading when the
 * section receives focus. Pass `className` to override the inner
 * container's layout (e.g. `grid grid-cols-2` for the Summary block).
 */
export function InfoSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <Container spacing="group" as="section" aria-labelledby={sectionId}>
      <h3
        id={sectionId}
        className="text-sm @lg:text-base font-medium capitalize"
      >
        {title}
      </h3>
      <Container spacing="group" className={className}>
        {children}
      </Container>
    </Container>
  );
}

// ====================================================
// ConditionalInfoSection
// ====================================================

/**
 * Renders an InfoSection preceded by a Separator, or nothing at all if
 * every item in `items` has a null value.
 *
 * Centralises the "skip empty sections" guard so callers don't need to
 * check field availability before rendering. Use `contentOrientation` to
 * switch InfoRow's internal layout — "flex" for the Contact section where
 * actions sit below the value, "grid" (default) everywhere else.
 */
export function ConditionalInfoSection({
  title,
  items,
  contentOrientation = "grid",
}: {
  title: string;
  items: InfoRowProps[];
  contentOrientation?: "grid" | "flex";
}) {
  if (!hasAnyValue(items)) return null;
  return (
    <>
      <Separator />
      <InfoSection title={title}>
        {items.map((item) => (
          <InfoRow
            key={item.label}
            contentOrientation={contentOrientation}
            {...item}
          />
        ))}
      </InfoSection>
    </>
  );
}

// ====================================================
// InfoRow
// ====================================================

/**
 * Single label/value row within an InfoSection.
 * Returns null when `value` is falsy, so empty fields collapse silently.
 *
 * Layout switches between a 3-column grid (label + spanning value) and a
 * vertical flex stack via `contentOrientation`. A ContactActionGroup is
 * appended when `actions` are present, giving quick access to mailto/tel
 * links directly from the row.
 */

const BADGE_RENDERED_FIELDS = new Set(["source", "campaign"]);

export function InfoRow({
  label,
  value,
  actions,
  contentOrientation = "grid",
}: InfoRowProps) {
  if (!value) return null;

  const isBadge = BADGE_RENDERED_FIELDS.has(label.toLowerCase());
  return (
    <Item size="xs" className="p-0">
      <ItemContent
        className={cn({
          "grid grid-cols-3": contentOrientation === "grid",
          "flex flex-col gap-2": contentOrientation === "flex",
        })}
      >
        <ItemTitle className="capitalize text-xs font-normal text-subtle-foreground">
          {label}
        </ItemTitle>
        {isBadge ? (
          <div className="col-span-2">
            <Badge size="sm" intent="outline">
              {value}
            </Badge>
          </div>
        ) : (
          <ItemDescription className="col-span-2 wrap-break-word text-foreground text-sm">
            {value}
          </ItemDescription>
        )}
      </ItemContent>
      <ContactActionGroup actions={actions} value={value} />
    </Item>
  );
}

// ====================================================
// SummaryRow
// ====================================================

/**
 * Label/value row used exclusively in the Summary section.
 * Renders the value as a Badge rather than plain text, with the variant
 * controlling the colour (e.g. destructive for Priority, success for Score).
 * Returns null when `value` is falsy, so optional fields like Score are
 * suppressed automatically without conditional logic at the call site.
 */
export function SummaryRow({ label, value, variant }: SummaryRowProps) {
  if (!value) return null;
  return (
    <Item size="xs" className="p-0">
      <ItemContent className="flex flex-col gap-2">
        <ItemTitle className="capitalize text-xs font-normal text-subtle-foreground">
          {label}
        </ItemTitle>
        {label.toLowerCase() === "priority" ? (
          <PriorityBadge priority={value as LeadPriority} />
        ) : (
          <Badge variant={variant} intent="outline" size="sm">
            {value}
          </Badge>
        )}
      </ItemContent>
    </Item>
  );
}

// ====================================================
// ContactActionGroup
// ====================================================

/**
 * Renders a row of one-tap contact action buttons (e.g. Message, Call, Visit)
 * adjacent to a field value. Returns null when no actions are provided,
 * so InfoRow renders cleanly for non-contact fields.
 *
 * Each button uses `responsiveIcon` mode — icon-only on small viewports,
 * icon + label on larger ones. The `aria-label` combines the action label
 * and field value (e.g. "Call 555-1234") for screen reader clarity, while
 * `aria-hidden` on the icon prevents it from being read out twice.
 */
export function ContactActionGroup({
  actions,
  value,
}: {
  actions?: ContactAction[];
  value: string;
}) {
  if (!actions?.length) return null;
  return (
    <ItemActions>
      {actions.map(({ key, icon: Icon, label, href }) => (
        <Link
          key={key}
          intent="outline"
          mode="responsiveIcon"
          size="xs"
          href={href}
          aria-label={`${label} ${value}`}
        >
          <Icon aria-hidden="true" />
          <ControlLabel>{label}</ControlLabel>
        </Link>
      ))}
    </ItemActions>
  );
}
