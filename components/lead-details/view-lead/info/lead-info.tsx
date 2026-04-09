import { LeadWithRelations } from "@/types";
import { Container } from "@/components/ui/layout/containers";
import { LeadMetadata } from "@/types/leads/fields";
import { LeadMagnetType } from "@/types/leads/magnets";
import { SECTION_LABELS } from "@/components/lead-details/lib/constants";
import {
  buildContactActionsByKey,
  buildSummaryItems,
  buildDynamicSections,
} from "@/components/lead-details/view-lead/info/lib/helpers";
import { groupFieldsBySection } from "@/lib/leads/utils/magnets";
import {
  InfoSection,
  SummaryRow,
  ConditionalInfoSection,
} from "@/components/lead-details/view-lead/info/info-components";

// ====================================================
// LeadInfo
// ====================================================

export function LeadInfo({ lead }: { lead: LeadWithRelations }) {
  const metadata = (lead.metadata as LeadMetadata) ?? {};
  const magnetType = lead.leadMagnet?.name as LeadMagnetType | undefined;

  const grouped = groupFieldsBySection(magnetType);
  const contactActionsByKey = buildContactActionsByKey({
    email: lead.email,
    phone: metadata.phone,
    website: metadata.website,
  });
  const summaryItems = buildSummaryItems(lead);
  const dynamicSections = buildDynamicSections(
    lead,
    metadata,
    contactActionsByKey,
    grouped,
  );

  return (
    <Container spacing="block">
      <InfoSection title={SECTION_LABELS.SUMMARY} className="grid grid-cols-2">
        {summaryItems.map((item) => (
          <SummaryRow key={item.label} {...item} />
        ))}
      </InfoSection>

      {dynamicSections.map(({ section, label, items }) => (
        <ConditionalInfoSection
          key={section}
          title={label}
          items={items}
          contentOrientation={section === "CONTACT" ? "flex" : "grid"}
        />
      ))}
    </Container>
  );
}
