import { PrismaClient, ActivityType, LeadStatus } from "@prisma/client";
import { LEAD_MAGNETS, LeadMagnetType } from "@/types/leads/magnets";
import { generateLeads, buildLeadMagnetPayload, randomItem } from "./lib/utils";
import { DUMMY_USERS } from "./lib/constants";
import { seedUsers, UsernameToIdMap } from "./seedUsers";

const prisma = new PrismaClient();

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
  await prisma.user.deleteMany({});

  const usernameToId: UsernameToIdMap = await seedUsers();

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

    // Notes
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
        ? new Date(noteDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        : null;

      const authorUsername = randomItem(DUMMY_USERS).username;
      const updatedByUsername = hasBeenUpdated
        ? randomItem(DUMMY_USERS).username
        : null;

      await prisma.note.create({
        data: {
          lead: { connect: { id: createdLead.id } },
          content: notes[i].content,
          authorUser: { connect: { id: usernameToId[authorUsername] } },
          author: authorUsername,
          ...(updatedByUsername && {
            updatedByUser: { connect: { id: usernameToId[updatedByUsername] } },
            updatedBy: updatedByUsername,
          }),
          contentUpdatedAt,
          isPinned,
          pinnedAt: isPinned ? noteDate : null,
          createdAt: noteDate,
        },
      });
    }

    // Lead created activity (automated - no user)
    await prisma.activity.create({
      data: {
        lead: { connect: { id: createdLead.id } },
        type: ActivityType.LEAD_CREATED,
        metadata: { source: createdLead.source },
        createdAt: createdLead.createdAt,
      },
    });

    // Status change activity (40% chance, only if not NEW)
    if (Math.random() > 0.6 && createdLead.status !== LeadStatus.NEW) {
      const performedByUsername = randomItem(DUMMY_USERS).username;
      await prisma.activity.create({
        data: {
          lead: { connect: { id: createdLead.id } },
          type: ActivityType.STATUS_CHANGED,
          performedByUser: {
            connect: { id: usernameToId[performedByUsername] },
          },
          performedBy: performedByUsername,
          metadata: { from: LeadStatus.NEW, to: createdLead.status },
          createdAt: new Date(
            createdLead.createdAt.getTime() + 24 * 60 * 60 * 1000,
          ),
        },
      });
    }

    // Priority change activity (30% chance, only if not MEDIUM)
    if (Math.random() > 0.7 && createdLead.priority !== "MEDIUM") {
      const performedByUsername = randomItem(DUMMY_USERS).username;
      await prisma.activity.create({
        data: {
          lead: { connect: { id: createdLead.id } },
          type: ActivityType.PRIORITY_CHANGED,
          performedByUser: {
            connect: { id: usernameToId[performedByUsername] },
          },
          performedBy: performedByUsername,
          metadata: { from: "MEDIUM", to: createdLead.priority },
          createdAt: new Date(
            createdLead.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000,
          ),
        },
      });
    }

    // Lead updated activity (25% chance)
    if (Math.random() > 0.75) {
      const performedByUsername = randomItem(DUMMY_USERS).username;
      await prisma.activity.create({
        data: {
          lead: { connect: { id: createdLead.id } },
          type: ActivityType.LEAD_UPDATED,
          performedByUser: {
            connect: { id: usernameToId[performedByUsername] },
          },
          performedBy: performedByUsername,
          metadata: {
            fields: [
              {
                field: "source",
                from: "ORGANIC_SEARCH",
                to: createdLead.source,
              },
            ],
          },
          createdAt: new Date(
            createdLead.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000,
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
