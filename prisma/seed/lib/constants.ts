import { LeadStatus, LeadPriority, UserRole } from "@prisma/client";

// ===========================================================
// Dummy Users
// ===========================================================

export const DUMMY_USERS = [
  {
    name: "Admin User",
    username: "admin",
    email: "admin@demo.com",
    password: "password123",
    role: "OWNER" as UserRole,
  },
  {
    name: "Tanya Bell",
    username: "tanyabell",
    email: "tanyabell@demo.com",
    password: "password123",
    role: "ADMIN" as UserRole,
  },
  {
    name: "RX Hendricks",
    username: "rx_hendricks",
    email: "rx_hendricks@demo.com",
    password: "password123",
    role: "MEMBER" as UserRole,
  },
  {
    name: "Jake Morris",
    username: "jakemorris92",
    email: "jakemorris92@demo.com",
    password: "password123",
    role: "MEMBER" as UserRole,
  },
];

// ===========================================================
// Enum Pools
// Available options for each enum type, used for random selection
// ===========================================================
export const LEAD_STATUS_OPTIONS = Object.values(LeadStatus);
export const LEAD_PRIORITY_OPTIONS = Object.values(LeadPriority);

// ===========================================================
// Notes
// Contextual notes specific to this gym business.
// Source-specific notes are only used when the lead's source matches.
// ===========================================================
export const GENERAL_NOTES = [
  "Called to confirm interest — left voicemail, awaiting callback.",
  "Expressed interest in morning classes before work.",
  "Asked about parking availability at the gym.",
  "Wants to know if a friend can join for the first session.",
  "Mentioned they haven't worked out in over a year — needs a beginner-friendly plan.",
  "Interested in couples or partner training options.",
  "Asked about locker room and shower facilities.",
  "Prefers female trainer — noted for follow-up.",
  "Has a knee injury — needs low-impact program recommendation.",
  "Requested a tour of the facility before committing.",
  "Very motivated — mentioned a wedding in 4 months as their goal deadline.",
  "Comparing us with another gym down the street — needs strong follow-up.",
  "Asked if we offer corporate discounts for their workplace.",
  "Wants to trial the gym during peak hours to check crowding.",
  "Mentioned kids — asked about childcare options during workouts.",
  "Follow-up scheduled for end of month when their current gym contract expires.",
  "Responded quickly to initial outreach — high intent.",
  "Budget is tight — may be a good candidate for the student membership.",
  "Asked about freezing membership during travel periods.",
  "Wants to know if personal training sessions can roll over month to month.",
];

export const REFERRAL_NOTES = [
  "Referred by existing member Jake Thompson — offered referral discount.",
  "Came in through a friend referral — already familiar with our programs.",
  "Referred by a current member — mentioned they've heard great things about the trainers.",
  "Friend referred them specifically for the nutrition coaching program.",
];

export const CAMPAIGN_NOTES = [
  "Came in through the spring promo — asked if the discount applies to personal training add-ons.",
  "Found us via the Facebook ad — mentioned the transformation photos caught their attention.",
  "Signed up after seeing the Google ad — searched specifically for gyms with nutrition plans.",
  "Responded to the summer fitness challenge campaign — very competitive, wants to win.",
  "Clicked the free webinar ad — lots of questions about the follow-up coaching program.",
  "LinkedIn outreach convert — works in a sedentary office job, motivated to get active.",
];

export const WEBSITE_NOTES = [
  "Browsed the pricing page before submitting — likely comparing plans.",
  "Came through the blog — read the article on beginner strength training.",
  "Submitted via the homepage contact form — no specific program mentioned yet.",
  "Found us through Google search — typed 'gym near me with nutrition coaching'.",
];
