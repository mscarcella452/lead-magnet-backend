import { faker } from "@faker-js/faker";
import { LeadStatus, LeadPriority } from "@prisma/client";
import { LEAD_MAGNETS, LeadMagnetType } from "@/types/leads/magnets";
import {
  LEAD_FIELD_REGISTRY,
  LeadFieldKey,
  LeadMetadata,
  DB_LEAD_COLUMNS,
} from "@/types/leads/fields";
import {
  LeadSource,
  LeadCampaign,
  LEAD_SOURCES,
  LEAD_CAMPAIGNS,
  ALWAYS_CAMPAIGN_SOURCES,
  OCCASIONAL_CAMPAIGN_SOURCES,
} from "@/types/leads/constants";
import {
  GENERAL_NOTES,
  REFERRAL_NOTES,
  WEBSITE_NOTES,
  CAMPAIGN_NOTES,
  LEAD_STATUS_OPTIONS,
  LEAD_PRIORITY_OPTIONS,
} from "./lib/constants";

// ===========================================================
// Primitive Helpers
// ===========================================================
export function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomDate(maxDaysAgo: number): Date {
  return faker.date.recent({ days: maxDaysAgo });
}

export function generateDisplayId(): string {
  return `LD-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
}

// ===========================================================
// Note Selector
// Builds a pool of eligible notes based on the lead's source,
// then picks unique notes without repeating.
// ===========================================================
const REFERRAL_SOURCES = new Set<LeadSource>(["REFERRAL", "PARTNER_REFERRAL"]);
const WEBSITE_SOURCES = new Set<LeadSource>([
  "WEBSITE_HOMEPAGE",
  "WEBSITE_CONTACT",
  "WEBSITE_PRICING",
  "WEBSITE_BLOG",
  "WEBSITE_DEMO",
  "ORGANIC_SEARCH",
]);

export function pickUniqueNotes(source: LeadSource, count: number): string[] {
  const pool = [
    ...GENERAL_NOTES,
    ...(REFERRAL_SOURCES.has(source) ? REFERRAL_NOTES : []),
    ...(ALWAYS_CAMPAIGN_SOURCES.has(source) ? CAMPAIGN_NOTES : []),
    ...(WEBSITE_SOURCES.has(source) ? WEBSITE_NOTES : []),
  ];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ===========================================================
// Field Generators
// Maps each metadata field key to a faker-based generator.
// Top-level DB columns (name, email, etc.) are excluded.
// ===========================================================
const FIELD_GENERATORS: Partial<Record<LeadFieldKey, () => string>> = {
  phone: () => faker.phone.number({ style: "national" }),
  location: () =>
    `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
  company: () => faker.company.name(),
  job_title: () => faker.person.jobTitle(),
  website: () => faker.internet.url(),
  preferred_trainer: () => faker.person.fullName(),
  fitness_goal: () => randomItem(LEAD_FIELD_REGISTRY.fitness_goal.options!),
  dietary_restrictions: () =>
    randomItem(LEAD_FIELD_REGISTRY.dietary_restrictions.options!),
  membership_type: () =>
    randomItem(LEAD_FIELD_REGISTRY.membership_type.options!),
};

export function generateMetadataForMagnet(
  magnetType: LeadMagnetType,
): LeadMetadata {
  return LEAD_MAGNETS[magnetType].fields.reduce<LeadMetadata>((acc, key) => {
    if (DB_LEAD_COLUMNS.has(key)) return acc;
    const generator = FIELD_GENERATORS[key];
    if (generator) acc[key] = generator();
    return acc;
  }, {});
}

// ===========================================================
// Lead Magnet DB Payload
// Builds the data object for prisma.leadMagnet.create()
// ===========================================================
export function buildLeadMagnetPayload(
  definition: (typeof LEAD_MAGNETS)[LeadMagnetType],
) {
  return {
    name: definition.label,
    fields: definition.fields.map((key) => ({
      key,
      label: LEAD_FIELD_REGISTRY[key].label,
      section: LEAD_FIELD_REGISTRY[key].section,
      order: LEAD_FIELD_REGISTRY[key].order,
    })),
  };
}

// ===========================================================
// Source & Campaign Generator
// Campaign is always set for paid/campaign-driven sources,
// occasionally set for website sources, and never set for
// organic, direct, or referral sources.
// ===========================================================
function generateSourceAndCampaign(): {
  source: LeadSource;
  campaign: LeadCampaign | null;
} {
  const source = randomItem(LEAD_SOURCES);
  const campaign = ALWAYS_CAMPAIGN_SOURCES.has(source)
    ? randomItem(LEAD_CAMPAIGNS)
    : OCCASIONAL_CAMPAIGN_SOURCES.has(source) && Math.random() > 0.7
      ? randomItem(LEAD_CAMPAIGNS)
      : null;

  return { source, campaign };
}

// ===========================================================
// Lead Generator
// Produces a flat list of leads sorted newest-first.
// ===========================================================
export type GeneratedLead = {
  displayId: string;
  email: string;
  name: string;
  source: LeadSource;
  campaign: LeadCampaign | null;
  status: LeadStatus;
  priority: LeadPriority;
  metadata: LeadMetadata;
  magnetType: LeadMagnetType;
  createdAt: Date;
  notes: { content: string; source: LeadSource }[];
};

export function generateLeads(
  distribution: Record<LeadMagnetType, number>,
): GeneratedLead[] {
  const leads: GeneratedLead[] = [];
  const usedEmails = new Set<string>();
  const usedDisplayIds = new Set<string>();

  for (const [magnetType, count] of Object.entries(distribution) as [
    LeadMagnetType,
    number,
  ][]) {
    let generated = 0;
    let attempts = 0;

    while (generated < count && attempts < count * 10) {
      attempts++;

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();

      if (usedEmails.has(email)) continue;

      let displayId = generateDisplayId();
      while (usedDisplayIds.has(displayId)) displayId = generateDisplayId();

      usedEmails.add(email);
      usedDisplayIds.add(displayId);

      const { source, campaign } = generateSourceAndCampaign();

      const noteCount =
        Math.random() > 0.1 ? faker.number.int({ min: 1, max: 4 }) : 0;
      const notes = pickUniqueNotes(source, noteCount).map((content) => ({
        content,
        source,
      }));

      leads.push({
        displayId,
        email,
        name: `${firstName} ${lastName}`,
        source,
        campaign,
        status: randomItem(LEAD_STATUS_OPTIONS),
        priority: randomItem(LEAD_PRIORITY_OPTIONS),
        metadata: generateMetadataForMagnet(magnetType),
        magnetType,
        createdAt: randomDate(90),
        notes,
      });

      generated++;
    }
  }

  return leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
