import { SITE_URL } from "./config";

export function ServiceSchema({ name, description }: { name: string; description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: "AHOS", url: SITE_URL },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD" },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function AllServicesSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: "AHOS" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AHOS Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development", description: "Premium websites, landing pages, and e-commerce platforms." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development", description: "Native iOS, Android, and cross-platform mobile applications." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Development", description: "Tailored platforms, dashboards, and business systems." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI & Automation", description: "Custom AI tools, chatbots, and workflow automation." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web3 & Blockchain", description: "Smart contracts, dapps, and decentralized applications." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-Commerce", description: "Shopify, WooCommerce, and custom e-commerce stores." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX & Brand Design", description: "Interfaces, brand identities, and design systems." } },
      ],
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
