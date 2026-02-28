import { LeadWithRelations } from "@/types";
import { Container } from "@/components/ui/layout/containers";
import { formatDate } from "@/lib/utils/dates";
import { Mail, Phone, Globe, LucideIcon, Video } from "lucide-react";
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

// ─────────────────────────────────────────────
// Demo data (placeholder until real lead loads)
// ─────────────────────────────────────────────

const demoLead = {
  id: "lead_001",
  name: "Jordan Matthews",
  status: "Qualified",
  priority: "High",
  score: 82,
  contact: {
    email: "jordan@northstarfitness.com",
    phone: "(512) 555-0148",
    website: "https://northstarfitness.com",
    location: "Austin, TX",
  },
  business: {
    company: "Northstar Fitness",
    industry: "Health & Fitness",
    companySize: "11–25",
  },
  source: {
    leadSource: "Google Ads",
    campaign: "Local Gym Website Redesign",
    assignedTo: "Admin",
    createdBy: "Website Form",
  },
  meta: {
    createdAt: "2026-02-10T14:32:00Z",
    updatedAt: "2026-02-18T09:14:00Z",
  },
};

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ContactActionKey = "Email" | "Phone" | "Website" | "Video";

interface ContactAction {
  icon: LucideIcon;
  label: string;
  getHref: (value: string) => string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const CONTACT_ACTIONS: Record<ContactActionKey, ContactAction> = {
  Email: {
    icon: Mail,
    label: "Message",
    getHref: (value) => `mailto:${value}`,
  },
  Phone: {
    icon: Phone,
    label: "Call",
    getHref: (value) => `tel:${value.replace(/\D/g, "")}`,
  },
  Video: {
    icon: Video,
    label: "Video Call",
    getHref: (value) => `tel:${value.replace(/\D/g, "")}`,
  },
  Website: {
    icon: Globe,
    label: "Visit",
    getHref: (value) => value,
  },
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export function LeadDemoInfo({ lead }: { lead: LeadWithRelations }) {
  const formattedUpdatedAt = formatDate(lead.updatedAt);

  const summaryItems: SummaryRowProps[] = [
    {
      label: "Assigned To",
      value: demoLead.source.assignedTo,
      variant: "primary",
    },
    { label: "Last Updated", value: formattedUpdatedAt, variant: "primary" },
    { label: "Priority", value: demoLead.priority, variant: "destructive" },
    { label: "Score", value: String(demoLead.score), variant: "success" },
  ];

  const contactItems: InfoRowProps[] = [
    { label: "Email", value: demoLead.contact.email },
    { label: "Phone", value: demoLead.contact.phone },
    { label: "Website", value: demoLead.contact.website },
    { label: "Location", value: demoLead.contact.location },
  ];

  const businessItems: InfoRowProps[] = [
    { label: "Company", value: demoLead.business.company },
    { label: "Industry", value: demoLead.business.industry },
    { label: "Company Size", value: demoLead.business.companySize },
  ];

  const sourceItems: InfoRowProps[] = [
    { label: "Lead Source", value: demoLead.source.leadSource },
    { label: "Campaign", value: demoLead.source.campaign },
    { label: "Created By", value: demoLead.source.createdBy },
  ];

  return (
    <Container spacing="block">
      <InfoSection title="Lead Summary" className="grid grid-cols-2">
        {summaryItems.map((item) => (
          <SummaryRow key={item.label} {...item} />
        ))}
      </InfoSection>

      <Separator />

      <InfoSection title="Contact">
        {contactItems.map((item) => (
          <InfoRow key={item.label} contentOrientation="flex" {...item} />
        ))}
      </InfoSection>

      <Separator />

      <InfoSection title="Business">
        {businessItems.map((item) => (
          <InfoRow key={item.label} {...item} />
        ))}
      </InfoSection>

      <Separator />

      <InfoSection title="Source">
        {sourceItems.map((item) => (
          <InfoRow key={item.label} {...item} />
        ))}
      </InfoSection>
    </Container>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function InfoSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container
      spacing="group"
      as="section"
      aria-labelledby={`section-${title.toLowerCase()}`}
    >
      <h3
        id={`section-${title.toLowerCase()}`}
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

interface InfoRowProps {
  label: string;
  value: string | null;
  contentOrientation?: "grid" | "flex";
}

function InfoRow({ label, value, contentOrientation = "grid" }: InfoRowProps) {
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

      <ContactAction label={label} value={value} />
    </Item>
  );
}

function ContactAction({ label, value }: { label: string; value: string }) {
  const action = CONTACT_ACTIONS[label as ContactActionKey];
  const videoAction = CONTACT_ACTIONS["Video"];
  if (!action) return null;

  const { icon: Icon, label: actionLabel, getHref } = action;

  return (
    <ItemActions>
      <Link
        intent="outline"
        mode="responsiveIcon"
        size="xs"
        href={getHref(value)}
        aria-label={`${actionLabel} ${value}`}
      >
        <Icon aria-hidden="true" />
        <ControlLabel>{actionLabel}</ControlLabel>
      </Link>
      {label === "Phone" && (
        <Link
          intent="outline"
          mode="responsiveIcon"
          size="xs"
          href={videoAction.getHref(value)}
          aria-label={`${videoAction.label} ${value}`}
        >
          <videoAction.icon aria-hidden="true" />
          <ControlLabel>{videoAction.label}</ControlLabel>
        </Link>
      )}
    </ItemActions>
  );
}

interface SummaryRowProps {
  label: string;
  value: string | null;
  variant?: BadgeProps["variant"];
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
