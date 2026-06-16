// ─────────────────────────────────────────────────────────────
// Single source of truth for all SEO / GEO metadata.
// Change SITE_URL here if the canonical domain ever moves.
// ─────────────────────────────────────────────────────────────

// Canonical brand domain (root, no trailing slash, no base path).
// All absolute SEO URLs (canonical, OG image, sitemap) derive from this.
export const SITE_URL = "https://ahos.xyz";

export const SITE_NAME = "AHOS — Digital Product Studio";
export const LEGAL_NAME = "Advanced Hybrid Online Systems";
export const SHORT_NAME = "AHOS";

export const DEFAULT_DESC =
  "AHOS is a digital product studio building premium websites, custom software, Web3 platforms, AI tools, and brand identities for businesses worldwide — from strategy to launch, under one roof.";

export const EMAIL = "info@ahos.xyz";
export const LOCALE = "en_US";

// Network / Author handles
export const SOCIALS = [
  "https://www.instagram.com/ahos.xyz/",
  "https://www.linkedin.com/company/ahos-xyz",
  "https://www.youtube.com/@ahos_xyz",
];

// Geographic targeting (local SEO). Country-level — accurate, not fabricated.
export const GEO = {
  region: "LB", // ISO 3166 — Lebanon
  country: "Lebanon",
  countryCode: "LB",
  placename: "Lebanon",
  latitude: 33.8938,
  longitude: 35.5018,
};

// Things AHOS is an authority on — strengthens entity recognition for AI engines.
export const KNOWS_ABOUT = [
  "Web Development",
  "Custom Software Development",
  "SaaS Platforms",
  "Web3 Development",
  "Smart Contracts",
  "Blockchain",
  "Artificial Intelligence",
  "Automation",
  "Brand Identity",
  "UI/UX Design",
  "E-commerce",
  "Mobile App Development",
];

// Absolute SEO asset URLs always resolve against the canonical domain ROOT
// (ahos.xyz/…), independent of the build's base path. The base path only
// affects assets the browser loads from the current deploy (favicon, manifest).
export const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
export const LOGO_URL = `${SITE_URL}/logo.png`;
