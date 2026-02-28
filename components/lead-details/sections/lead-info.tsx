import { LeadWithRelations } from "@/types";
import { Container } from "@/components/ui/layout/containers";
import { formatDate } from "@/lib/utils/dates";
import { Mail, Phone, Globe, Video, LucideIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Badge, BadgeProps } from "@/components/ui/feedback/badge";
import { Link, ControlLabel } from "@/components/ui/controls";
import { Separator } from "@/components/ui/layout/separator";
import { cn } from "@/lib/utils/index";

// ====================================================
// Types
// ====================================================

interface ContactAction {
  key: string;
  icon: LucideIcon;
  label: string;
  href: string;
}

interface InfoRowProps {
  label: string;
  value: string | null;
  actions?: ContactAction[];
  contentOrientation?: "grid" | "flex";
}

interface SummaryRowProps {
  label: string;
  value: string | null;
  variant?: BadgeProps["variant"];
}

// ====================================================
// Business Logic
// ====================================================

interface LeadContactMeta {
  email?: string | null;
  phone?: string | null;
  website?: string | null;
}

function buildContactActions(meta: LeadContactMeta): ContactAction[] {
  const actions: ContactAction[] = [];

  if (meta.email) {
    actions.push({
      key: "email",
      icon: Mail,
      label: "Message",
      href: `mailto:${meta.email}`,
    });
  }

  if (meta.phone) {
    const clean = meta.phone.replace(/\D/g, "");
    actions.push(
      { key: "phone", icon: Phone, label: "Call", href: `tel:${clean}` },
      { key: "video", icon: Video, label: "Video Call", href: `tel:${clean}` },
    );
  }

  if (meta.website) {
    actions.push({
      key: "website",
      icon: Globe,
      label: "Visit",
      href: meta.website,
    });
  }

  return actions;
}

// ====================================================
// Helpers
// ====================================================

const hasAnyValue = (items: InfoRowProps[]) =>
  items.some((item) => item.value !== null);

// ====================================================
// Main Component
// ====================================================

export function LeadInfo({ lead }: { lead: LeadWithRelations }) {
  const metadata = (lead.metadata as Record<string, string>) ?? {};
  const contactActions = buildContactActions({
    email: lead.email,
    phone: metadata.phone,
    website: metadata.website,
  });

  const summaryItems: SummaryRowProps[] = [
    { label: "Priority", value: lead.priority, variant: "destructive" },
    ...(lead.score != null
      ? [
          {
            label: "Score",
            value: String(lead.score),
            variant: "success" as const,
          },
        ]
      : []),
    {
      label: "Last Updated",
      value: formatDate(lead.updatedAt),
      variant: "primary",
    },
  ];

  // Actions are passed per-row so each row only renders its own actions.
  // buildContactActions runs once above; we just filter here — no extra work.
  const contactItems: InfoRowProps[] = [
    {
      label: "Email",
      value: lead.email,
      actions: contactActions.filter((a) => a.key === "email"),
    },
    {
      label: "Phone",
      value: metadata.phone ?? null,
      actions: contactActions.filter(
        (a) => a.key === "phone" || a.key === "video",
      ),
    },
    {
      label: "Website",
      value: metadata.website ?? null,
      actions: contactActions.filter((a) => a.key === "website"),
    },
    { label: "Location", value: metadata.location ?? null },
  ];

  const businessItems: InfoRowProps[] = [
    { label: "Company", value: metadata.company ?? null },
    { label: "Industry", value: metadata.industry ?? null },
    { label: "Company Size", value: metadata.companySize ?? null },
  ];

  const sourceItems: InfoRowProps[] = [
    { label: "Lead Source", value: lead.source ?? null },
    { label: "Campaign", value: lead.campaign ?? null },
    { label: "Created By", value: metadata.createdBy ?? null },
  ];

  return (
    <Container spacing="block">
      <InfoSection title="Lead Summary" className="grid grid-cols-2">
        {summaryItems.map((item) => (
          <SummaryRow key={item.label} {...item} />
        ))}
      </InfoSection>

      <ConditionalInfoSection
        title="Contact"
        items={contactItems}
        contentOrientation="flex"
      />
      <ConditionalInfoSection title="Business" items={businessItems} />
      <ConditionalInfoSection title="Source" items={sourceItems} />
    </Container>
  );
}

// ====================================================
// Section Components
// ====================================================

function InfoSection({
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

function ConditionalInfoSection({
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
// Row Components
// ====================================================

function InfoRow({
  label,
  value,
  actions,
  contentOrientation = "grid",
}: InfoRowProps) {
  if (!value) return null;

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
        <ItemDescription className="col-span-2 wrap-break-word text-foreground text-sm">
          {value}
        </ItemDescription>
      </ItemContent>

      <ContactActionGroup actions={actions} value={value} />
    </Item>
  );
}

function SummaryRow({ label, value, variant }: SummaryRowProps) {
  if (!value) return null;

  return (
    <Item size="xs" className="p-0">
      <ItemContent className="flex flex-col gap-2">
        <ItemTitle className="capitalize text-xs font-normal text-subtle-foreground">
          {label}
        </ItemTitle>
        <Badge variant={variant} intent="outline" size="sm">
          {value}
        </Badge>
      </ItemContent>
    </Item>
  );
}

// ====================================================
// Contact Action Components
// ====================================================

function ContactActionGroup({
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
