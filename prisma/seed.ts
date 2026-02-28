import { PrismaClient, LeadSource, LeadStatus, LeadCampaign, LeadPriority, ActivityType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed script to populate database with 56 fake leads
 * Run with: pnpm prisma db push && pnpm tsx prisma/seed.ts
 */

// Data pools for random generation
const FIRST_NAMES = [
  "Sarah",
  "Mike",
  "Emily",
  "David",
  "Jessica",
  "Robert",
  "Amanda",
  "James",
  "Lisa",
  "Kevin",
  "Michelle",
  "Daniel",
  "Jennifer",
  "Christopher",
  "Ashley",
  "Matthew",
  "Lauren",
  "Andrew",
  "Nicole",
  "Ryan",
  "Stephanie",
  "Brandon",
  "Rachel",
  "Justin",
  "Megan",
  "Tyler",
  "Brittany",
  "Joshua",
  "Samantha",
  "Jonathan",
  "Elizabeth",
  "Nathan",
  "Rebecca",
  "Eric",
  "Laura",
  "Jacob",
  "Hannah",
  "Alexander",
  "Alexis",
  "Zachary",
  "Kayla",
  "Kyle",
  "Victoria",
  "Austin",
  "Madison",
  "Ethan",
  "Taylor",
  "Noah",
  "Olivia",
  "Logan",
  "Emma",
  "Mason",
  "Sophia",
  "Lucas",
  "Ava",
  "Liam",
  "Isabella",
];

const LAST_NAMES = [
  "Johnson",
  "Chen",
  "Rodriguez",
  "Kim",
  "Martinez",
  "Taylor",
  "White",
  "Anderson",
  "Thompson",
  "Brown",
  "Garcia",
  "Wilson",
  "Moore",
  "Lee",
  "Harris",
  "Clark",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Phillips",
  "Evans",
  "Turner",
  "Parker",
  "Collins",
  "Edwards",
  "Stewart",
  "Morris",
  "Murphy",
  "Cook",
  "Rogers",
  "Morgan",
  "Peterson",
  "Cooper",
  "Reed",
  "Bailey",
  "Bell",
  "Gomez",
  "Kelly",
];

const COMPANIES = [
  "Tech Innovations Inc",
  "Global Solutions LLC",
  "StartUp Ventures",
  "Marketing Pro Agency",
  "E-commerce Plus",
  "Digital Marketing Co",
  "Consulting Group",
  "Growth Strategies Inc",
  "Enterprise Systems",
  "Cloud Services Ltd",
  "Data Analytics Corp",
  "Software Solutions",
  "Creative Agency",
  "Business Intelligence",
  "Mobile Apps Inc",
  "Web Development Co",
  "AI Technologies",
  "Cyber Security Firm",
  "Finance Solutions",
  "Healthcare Tech",
  "Education Platform",
  "Real Estate Group",
  "Retail Innovations",
  "Manufacturing Co",
  "Logistics Systems",
  "Energy Solutions",
  "Media Productions",
  "Design Studio",
  "Architecture Firm",
  "Legal Services",
];

const INTERESTS = [
  "Enterprise Plan",
  "Professional Plan",
  "Free Trial",
  "Custom Solution",
  "Starter Package",
  "Premium Features",
  "API Access",
  "White Label",
  "Consulting Services",
  "Training Program",
  "Support Package",
  "Integration Services",
  "Migration Assistance",
  "Bulk Licensing",
];

const BUDGETS = [
  "$1000/month",
  "$2000/month",
  "$5000/month",
  "$10000/month",
  "$500/month",
  "$3000/month",
  "$7500/month",
  "$15000/month",
];

const LEAD_SOURCES = Object.values(LeadSource);
const LEAD_STATUSES = Object.values(LeadStatus);
const LEAD_CAMPAIGNS = [
  "LOCAL_GYM_WEBSITE_REDESIGN",
  "SPRING_PROMO_2026",
  "SUMMER_FITNESS_CHALLENGE",
  "EMAIL_NEWSLETTER_SIGNUP",
  "FREE_WEBINAR_FEB",
  "FACEBOOK_AD_CAMPAIGN",
  "GOOGLE_ADS_CAMPAIGN",
  "LINKEDIN_OUTREACH",
  "PARTNER_PROMO",
  "BLOG_DOWNLOAD_PROMO",
] as const;
const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const NOTE_SAMPLES = [
  "Great potential, needs follow-up next week",
  "Budget approved, waiting on timeline",
  "Interested in enterprise plan",
  "Requested demo on Friday",
  "Competitor mentioned, needs positioning",
  "Decision maker unavailable until next month",
  "Positive feedback on proposal",
  "Needs integration with existing system",
  "Wants custom features",
  "Referred by existing customer",
];

const PERFORMERS = ["You", "Sales Team", "Account Manager", "Support"];

// Helper to generate random item from array
function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to generate random phone number
function randomPhone(): string {
  return `555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
}

// Helper to generate random date within last N days
function randomDate(maxDaysAgo: number): Date {
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

// Helper to generate random metadata
function randomMetadata(): Record<string, string> {
  const metadata: Record<string, string> = {
    phone: randomPhone(),
  };

  // Randomly add company (70% chance)
  if (Math.random() > 0.3) {
    metadata.company = randomItem(COMPANIES);
  }

  // Randomly add interest or budget (50% chance)
  if (Math.random() > 0.5) {
    metadata.interest = randomItem(INTERESTS);
  } else if (Math.random() > 0.5) {
    metadata.budget = randomItem(BUDGETS);
  }

  return metadata;
}

// Helper to generate short display ID
function generateDisplayId(): string {
  return `LD-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
}

// Generate unique leads
function generateUniqueLeads(count: number) {
  const leads = [];
  const usedEmails = new Set<string>();
  const usedDisplayIds = new Set<string>();

  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loop

  while (leads.length < count && attempts < maxAttempts) {
    attempts++;

    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    let displayId = generateDisplayId();

    // Ensure unique displayId
    while (usedDisplayIds.has(displayId)) {
      displayId = generateDisplayId();
    }

    // Check for duplicate emails
    if (usedEmails.has(email)) {
      continue;
    }

    usedEmails.add(email);
    usedDisplayIds.add(displayId);

    const score = Math.random() > 0.5 ? Math.floor(Math.random() * 100) : null;

    leads.push({
      displayId,
      email,
      name,
      source: Math.random() > 0.3 ? randomItem(LEAD_SOURCES) : null,
      campaign: Math.random() > 0.4 ? randomItem(LEAD_CAMPAIGNS) : null,
      status: randomItem(LEAD_STATUSES),
      priority: randomItem(LEAD_PRIORITIES),
      score,
      metadata: randomMetadata(),
      createdAt: randomDate(90), // Within last 90 days
    });
  }

  // Sort by createdAt descending (newest first)
  return leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function main() {
  console.log("Starting seed...");

  // Clear existing leads
  console.log("Clearing existing leads...");
  await prisma.lead.deleteMany({});

  // Generate 56 unique leads
  console.log("Generating 56 unique leads...");
  const leads = generateUniqueLeads(56);

  // Create leads in database with notes and activities
  console.log("Creating leads in database...");
  for (const lead of leads) {
    const createdLead = await prisma.lead.create({
      data: lead,
    });

    // Add 1-3 random notes to each lead (60% chance)
    if (Math.random() > 0.4) {
      const noteCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < noteCount; i++) {
        const noteDate = new Date(
          createdLead.createdAt.getTime() + i * 24 * 60 * 60 * 1000
        );
        await prisma.note.create({
          data: {
            leadId: createdLead.id,
            content: randomItem(NOTE_SAMPLES),
            author: randomItem(PERFORMERS),
            isPinned: Math.random() > 0.8, // 20% chance to pin
            createdAt: noteDate,
            updatedAt: noteDate,
          },
        });
      }
    }

    // Add activity for lead creation
    await prisma.activity.create({
      data: {
        leadId: createdLead.id,
        type: ActivityType.LEAD_CREATED,
        performedBy: randomItem(PERFORMERS),
        metadata: {
          source: createdLead.source,
        },
        createdAt: createdLead.createdAt,
      },
    });

    // Add random status change activities (40% chance)
    if (Math.random() > 0.6 && createdLead.status !== LeadStatus.NEW) {
      await prisma.activity.create({
        data: {
          leadId: createdLead.id,
          type: ActivityType.STATUS_CHANGED,
          performedBy: randomItem(PERFORMERS),
          metadata: {
            from: LeadStatus.NEW,
            to: createdLead.status,
          },
          createdAt: new Date(
            createdLead.createdAt.getTime() + 24 * 60 * 60 * 1000
          ),
        },
      });
    }
  }

  console.log(`Created ${leads.length} fake leads with notes and activities`);
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
