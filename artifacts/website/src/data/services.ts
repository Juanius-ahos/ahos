// Single source of truth for the service catalogue used by the nav dropdown,
// the RelatedServices cross-linking block, and (mirrored) the prerender plugin.
// Keep href/label in sync with the routes in App.tsx and plugins/prerender.ts.

export interface ServiceLink {
  href: string;
  label: string;
  /** Short, keyword-bearing descriptor used in menus and cross-links. */
  blurb: string;
}

export const SERVICES: ServiceLink[] = [
  { href: "/web-development", label: "Web Development", blurb: "Websites, e-commerce & web apps" },
  { href: "/mobile-app-development", label: "Mobile App Development", blurb: "iOS, Android & cross-platform" },
  { href: "/custom-software", label: "Custom Software", blurb: "SaaS, dashboards & APIs" },
  { href: "/ai-development", label: "AI Development", blurb: "AI tools, chatbots & automation" },
  { href: "/ecommerce-development", label: "E-Commerce Development", blurb: "Shopify, WooCommerce & custom stores" },
  { href: "/ui-ux-design", label: "UI/UX & Brand Design", blurb: "Interfaces & design systems" },
  { href: "/web3", label: "Web3 & Blockchain", blurb: "Smart contracts, dapps & DeFi" },
];

/** All services except the one at `current` — used for cross-linking. */
export const otherServices = (current: string): ServiceLink[] =>
  SERVICES.filter((s) => s.href !== current);
