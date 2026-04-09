export const LEAD_SOURCES = [
  "WEBSITE_HOMEPAGE",
  "WEBSITE_CONTACT",
  "WEBSITE_PRICING",
  "WEBSITE_BLOG",
  "WEBSITE_DEMO",
  "LANDING_PAGE_PROMO",
  "GOOGLE_ADS",
  "FACEBOOK_AD",
  "LINKEDIN_POST",
  "TWITTER_AD",
  "EMAIL_CAMPAIGN",
  "WEBINAR",
  "REFERRAL",
  "PARTNER_REFERRAL",
  "ORGANIC_SEARCH",
  "DIRECT",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_CAMPAIGNS = [
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

export type LeadCampaign = (typeof LEAD_CAMPAIGNS)[number];

// ===========================================================
// Campaign Sources
// Sources that are always or occasionally campaign-driven.
// Used to determine whether a campaign should be attached.
// ===========================================================
export const ALWAYS_CAMPAIGN_SOURCES = new Set<LeadSource>([
  "GOOGLE_ADS",
  "FACEBOOK_AD",
  "LINKEDIN_POST",
  "TWITTER_AD",
  "EMAIL_CAMPAIGN",
  "LANDING_PAGE_PROMO",
  "WEBINAR",
]);

export const OCCASIONAL_CAMPAIGN_SOURCES = new Set<LeadSource>([
  "WEBSITE_BLOG",
  "WEBSITE_HOMEPAGE",
  "WEBSITE_CONTACT",
  "WEBSITE_PRICING",
  "WEBSITE_DEMO",
]);
