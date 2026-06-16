export interface FAQItem {
  question: string;
  answer: string;
}

export const faqCategories = [
  {
    category: "General",
    items: [
      {
        question: "What is AHOS?",
        answer: "AHOS (Advanced Hybrid Online Systems) is a boutique digital product studio that builds websites, custom software, mobile apps, Web3/DeFi platforms, AI tools, and brand identities. We handle everything from strategy to launch under one roof — no juggling multiple agencies.",
      },
      {
        question: "What services does AHOS offer?",
        answer: "We offer custom software development, web development (landing pages to e-commerce), mobile app development, media & branding (video, animation, identity), Web3 & blockchain solutions (smart contracts, dapps, NFT launches), AI tools & automation, and ongoing maintenance & support.",
      },
      {
        question: "Where is AHOS based?",
        answer: "AHOS operates as a globally distributed remote team. We work with clients worldwide across different time zones. Our team members are located internationally, allowing us to provide round-the-clock support and flexibility.",
      },
      {
        question: "What industries do you work with?",
        answer: "We work across industries including restaurant & food, retail & e-commerce, real estate, fitness & wellness, finance & crypto, technology & SaaS, creative & media, healthcare, and more. Every solution is tailored to the specific needs of your industry.",
      },
      {
        question: "Do you offer ongoing support after launch?",
        answer: "Yes. Every project includes 30 days of post-launch support at no extra cost. We also offer ongoing maintenance, hosting, and support packages for clients who need long-term partnership beyond the initial build.",
      },
    ],
  },
  {
    category: "Web Development",
    items: [
      {
        question: "How long does it take to build a website?",
        answer: "Timelines vary by complexity: landing pages typically take 1–2 weeks, standard business websites 2–4 weeks, and e-commerce platforms 3–6 weeks. We'll give you a clear timeline during the discovery call based on your specific needs.",
      },
      {
        question: "Do you build e-commerce websites?",
        answer: "Yes, we build full e-commerce platforms with product management, payment processing, booking/scheduling, user accounts, and admin dashboards. Our e-commerce sites are fast, conversion-optimised, and scalable from day one.",
      },
      {
        question: "Are your websites mobile-friendly and responsive?",
        answer: "Absolutely. Every website we build is fully responsive across all devices — mobile, tablet, and desktop. We design mobile-first and ensure pixel-perfect performance on every screen size.",
      },
      {
        question: "Do you optimise websites for search engines?",
        answer: "Yes. SEO is built into every website we create — semantic HTML, proper heading hierarchy, meta tags, structured data (JSON-LD), fast load times, clean URLs, and descriptive content. We build sites that search engines can properly understand and rank.",
      },
      {
        question: "Can you redesign an existing website?",
        answer: "Yes. We frequently redesign and rebuild existing websites — improving the design, performance, user experience, and SEO while preserving (or migrating) your content and URLs. We'll audit your current site and create a tailored upgrade plan.",
      },
    ],
  },
  {
    category: "Custom Software",
    items: [
      {
        question: "Do you build SaaS platforms?",
        answer: "Yes, we build SaaS platforms from concept to launch — including user authentication, subscription billing, admin dashboards, API integrations, and scalable cloud infrastructure. We've built platforms for startups and established businesses alike.",
      },
      {
        question: "What tech stack do you use?",
        answer: "We're tech-agnostic and choose the best tools for each project. Our typical stack includes React, TypeScript, Node.js, Python, PostgreSQL, and cloud platforms like AWS and Vercel. For mobile apps we use React Native and Flutter. We always prioritise performance, scalability, and maintainability.",
      },
      {
        question: "Do you build mobile apps?",
        answer: "Yes, we build native and cross-platform mobile apps for iOS and Android. We've published apps on the Apple App Store and Google Play, including ride-booking apps, social platforms, and business tools.",
      },
      {
        question: "Will I own the source code?",
        answer: "Yes. You receive full ownership of all source code, assets, and intellectual property. There are no licensing fees or lock-in. We deliver everything you need to run and maintain your product independently.",
      },
    ],
  },
  {
    category: "Web3 & Blockchain",
    items: [
      {
        question: "Do you build smart contracts?",
        answer: "Yes. We design, develop, and deploy smart contracts for ERC-20 tokens, ERC-721/ERC-1155 NFTs, DAO governance systems, DeFi protocols, and multi-sig wallets. Every contract is rigorously tested and audited before deployment.",
      },
      {
        question: "What blockchains do you support?",
        answer: "We work with Ethereum, Solana, Polygon, BNB Chain, Arbitrum, Optimism, Base, and other EVM-compatible chains. We choose the best chain for your project's needs based on cost, speed, security, and target audience.",
      },
      {
        question: "Can you help launch an NFT or token project?",
        answer: "Yes. We handle the full launch lifecycle — minting platforms, staking interfaces, allowlist mechanics, reveal systems, and marketplace integrations. We've launched multiple NFT collections and token projects from concept to post-launch.",
      },
      {
        question: "Do you provide Web3 advisory and strategy?",
        answer: "Absolutely. Before writing any code, we help with tokenomics design, whitepaper structuring, go-to-market strategy, community growth planning, and technical roadmap creation to ensure your project launches with clarity and momentum.",
      },
    ],
  },
  {
    category: "Process & Pricing",
    items: [
      {
        question: "How does your process work?",
        answer: "Our process has three phases: (1) Discovery — a free 30-minute consultation where we understand your goals and provide a clear plan and quote; (2) Design & Build — we craft your solution with milestone check-ins and regular updates; (3) Launch & Support — full deployment, monitoring, and ongoing support.",
      },
      {
        question: "How much does a website or app cost?",
        answer: "Pricing depends on scope and complexity. We provide fixed-price quotes after our free discovery call, so there are no surprises. Budget ranges typically start from $1,000 for simple projects and scale based on features, pages, integrations, and timeline. Contact us for a tailored quote.",
      },
      {
        question: "Do you offer fixed-price quotes?",
        answer: "Yes. We provide fixed-price quotes with milestone-based payments. You'll know exactly what you're paying and what you're getting before any work begins. No hourly billing, no scope-creep surprises.",
      },
      {
        question: "How do I get started with AHOS?",
        answer: "Simply contact us through our website form and tell us about your project. We'll schedule a free 30-minute discovery call to understand your needs, answer your questions, and provide a clear plan and quote — usually within 24 hours.",
      },
      {
        question: "How quickly do you respond to inquiries?",
        answer: "We typically respond within 24 hours during business days. Many inquiries receive a response within a few hours. For urgent projects, mention it in your message and we'll prioritise accordingly.",
      },
    ],
  },
];

export const allFaqItems = faqCategories.flatMap((c) => c.items);
