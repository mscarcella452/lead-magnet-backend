import { PrismaClient, ActivityType, LeadStatus } from "@prisma/client";
import { LEAD_MAGNETS, LeadMagnetType } from "@/types/leads/magnets";
import {
  USERNAMES,
  generateLeads,
  buildLeadMagnetPayload,
  randomItem,
} from "./seed-utils";

const prisma = new PrismaClient();

// ===========================================================
// Distribution
// Uneven but realistic spread across lead magnets.
// Total = 57
// ===========================================================
const LEAD_MAGNET_DISTRIBUTION: Record<LeadMagnetType, number> = {
  FREE_TRIAL: 18,
  FITNESS_ASSESSMENT: 14,
  MEMBERSHIP_SIGNUP: 12,
  NUTRITION_PLAN: 8,
  PERSONAL_TRAINING: 4,
  CONTACT_FORM: 1,
};

async function main() {
  console.log("Starting seed...");

  console.log("Clearing existing data...");
  await prisma.activity.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.leadMagnet.deleteMany({});

  // ===========================================================
  // Seed LeadMagnet records from registry
  // ===========================================================
  console.log("Seeding lead magnets from registry...");
  const magnetRecords = await Promise.all(
    (
      Object.entries(LEAD_MAGNETS) as [
        LeadMagnetType,
        (typeof LEAD_MAGNETS)[LeadMagnetType],
      ][]
    ).map(([, definition]) =>
      prisma.leadMagnet.create({ data: buildLeadMagnetPayload(definition) }),
    ),
  );

  const magnetIdMap = Object.fromEntries(
    (Object.keys(LEAD_MAGNETS) as LeadMagnetType[]).map((type, i) => [
      type,
      magnetRecords[i].id,
    ]),
  ) as Record<LeadMagnetType, string>;

  // ===========================================================
  // Seed Leads
  // ===========================================================
  console.log("Generating leads...");
  const leads = generateLeads(LEAD_MAGNET_DISTRIBUTION);

  console.log("Creating leads with notes and activities...");
  for (const { magnetType, notes, ...lead } of leads) {
    const createdLead = await prisma.lead.create({
      data: {
        ...lead,
        leadMagnetId: magnetIdMap[magnetType as LeadMagnetType],
      },
    });

    // Notes — pre-generated in seed-utils, unique and source-appropriate
    for (let i = 0; i < notes.length; i++) {
      const noteDate = new Date(
        Math.min(
          createdLead.createdAt.getTime() + i * 24 * 60 * 60 * 1000,
          new Date().getTime(),
        ),
      );
      const isPinned = Math.random() > 0.8;
      const hasBeenUpdated = Math.random() > 0.8;
      const contentUpdatedAt = hasBeenUpdated
        ? new Date(noteDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // random time within 7 days after noteDate
        : null;

      await prisma.note.create({
        data: {
          leadId: createdLead.id,
          content: notes[i].content,
          author: randomItem(USERNAMES),
          isPinned,
          pinnedAt: isPinned ? noteDate : null,
          updatedBy: hasBeenUpdated ? randomItem(USERNAMES) : null,
          contentUpdatedAt,
          createdAt: noteDate,
        },
      });
    }

    // Lead created activity (automated - no performedBy)
    await prisma.activity.create({
      data: {
        leadId: createdLead.id,
        type: ActivityType.LEAD_CREATED,
        performedBy: null,
        metadata: { source: createdLead.source },
        createdAt: createdLead.createdAt,
      },
    });

    // Status change activity (40% chance, only if not NEW)
    if (Math.random() > 0.6 && createdLead.status !== LeadStatus.NEW) {
      await prisma.activity.create({
        data: {
          leadId: createdLead.id,
          type: ActivityType.STATUS_CHANGED,
          performedBy: randomItem(USERNAMES),
          metadata: { from: LeadStatus.NEW, to: createdLead.status },
          createdAt: new Date(
            createdLead.createdAt.getTime() + 24 * 60 * 60 * 1000,
          ),
        },
      });
    }
  }

  console.log(
    `Seeded ${leads.length} leads across ${magnetRecords.length} lead magnets.`,
  );
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
