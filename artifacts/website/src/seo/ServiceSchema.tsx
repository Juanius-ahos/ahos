export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: "AHOS",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AHOS Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Software Development",
            description: "Tailored platforms, dashboards, internal tools, and business systems built around the way your company actually works.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Development",
            description: "Premium websites, landing pages, and e-commerce platforms designed to look sharp, load fast, and convert clearly.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Media & Branding",
            description: "Video editing, 2D animation, brand identity, style guides, and social media packs that make your brand impossible to ignore.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web3 & Blockchain Development",
            description: "Smart contracts, dapps, NFT launches, token systems, and decentralized applications built with security and UX at the core.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI & Automation",
            description: "Custom AI tools, workflow automations, chatbot integrations, and operational systems that remove repetitive work.",
          },
        },
      ],
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
