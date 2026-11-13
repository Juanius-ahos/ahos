/**
 * site.config.ts
 *
 * The one config file for ahos.xyz. Every business fact, price, project, page
 * title, integration key and SEO value lives here. The app, the build-time
 * prerender, the JSON-LD, sitemap.xml, robots.txt and llms.txt all read from it.
 *
 * Copy rule: no em dashes anywhere. `pnpm check:copy` fails the build if one appears.
 */

export const site = {
  url: "https://ahos.xyz",
  name: "AHOS",
  legalName: "Advanced Hybrid Online Systems",
  siteName: "AHOS, design and engineering studio in Beirut",
  tagline: "Design that sells. Code that holds.",
  summary:
    "AHOS (Advanced Hybrid Online Systems) is a design and engineering studio in Beirut, Lebanon. One team designs and builds websites, online stores, mobile apps, custom software, AI assistants and Web3 products for businesses in Lebanon, the Gulf, Europe and the US.",
  founded: "2023",
  locale: "en_US",
  lang: "en",
  themeColor: "#17181b",

  contact: {
    email: "info@ahos.xyz",
    phone: "+961 70 165 601",
    phoneE164: "+96170165601",
    whatsapp: "https://wa.me/96170165601",
    /** Opens WhatsApp with a ready-written first message. Used by every "Message us" button. */
    whatsappHello: `https://wa.me/96170165601?text=${encodeURIComponent("Hi AHOS, I'd like to talk about a project.")}`,
    replyWithin: "24 hours",
    timeZone: "Asia/Beirut",
    /** Hours when someone is usually at a desk, Beirut time (24h). */
    deskHours: [9, 21] as [number, number],
  },

  address: {
    street: "Beirut Digital District",
    city: "Beirut",
    region: "Beirut",
    country: "LB",
    countryName: "Lebanon",
    lat: 33.8938,
    lng: 35.5018,
  },

  hours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },

  areasServed: ["Lebanon", "United Arab Emirates", "Saudi Arabia", "United States", "Europe"],
  areasLine: "Lebanon, the Gulf, Europe and the US",
  languages: ["English", "Arabic", "French"],

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/ahos.xyz/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/ahos-xyz" },
    { label: "YouTube", href: "https://www.youtube.com/@ahos_xyz" },
  ],
  twitter: "@ahos_xyz",

  /** Proof shown in the hero proof bar and page headers. Keep these true. */
  proof: [
    { value: "100+", label: "projects delivered" },
    { value: "LB US EU OM", label: "clients in Lebanon, the US, Europe and Oman" },
    { value: "5 stars", label: "in a client review on Trustpilot", href: "https://www.trustpilot.com/review/ahos.xyz" },
    { value: "30 days", label: "warranty on every build" },
    { value: "100%", label: "yours: code, design and content" },
  ],
  warranty: "30-day warranty on every build",

  integrations: {
    ga4: "G-8BRM1PM0V8",
    /** web3forms access key for the contact and careers forms. */
    web3formsKey: "840f1d96-d5b1-4659-8a5e-30eae7d9f5db",
    web3formsEndpoint: "https://api.web3forms.com/submit",
    /** Cloudflare Worker for ARIA (see /worker/SETUP.md). Empty uses the free fallback. */
    ariaWorkerUrl: "",
    ariaFallbackUrl: "https://text.pollinations.ai/openai",
  },

  ogImage: "/og.png",
  logo: "/logo.png",
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { href: "/work", label: "Work", match: "/work" },
  { href: "/services", label: "Services", match: "/services" },
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/aria-ai", label: "ARIA", match: "/aria-ai" },
  { href: "/faq", label: "FAQ", match: "/faq" },
];

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

export interface Project {
  id: string;
  name: string;
  what: string;
  where: string;
  year: string;
  /** One line on what the product does for its owner. */
  outcome: string;
  live: string;
  liveLabel: string;
  /** Case study path. Every project shown on the site has one. */
  caseStudy: string;
  /** Desktop capture: /work/d-{shot}.webp (1440) and d-{shot}-880.webp. Phone capture: /work/m-{shot}.webp. */
  shot?: string;
  /** Two flagship projects lead the work section. */
  flagship?: boolean;
  /** Flagships only: the build log shown while the homepage assembles the screenshot. Keep these true. */
  buildLog?: string[];
}

export const projects: Project[] = [
  {
    id: "issam",
    name: "Oman with Issam",
    what: "Multilingual website",
    where: "Muscat, Oman",
    year: "2026",
    outcome: "A private tour guide who speaks twelve languages now has a site that does too, with every tour a WhatsApp message away.",
    live: "https://omanwithissam.com",
    liveLabel: "omanwithissam.com",
    caseStudy: "/work/oman-with-issam",
    shot: "issam",
    flagship: true,
    buildLog: ["Greeting travelers in 13 languages", "Flipping Arabic to right-to-left", "Flying 8 tour routes over satellite maps", "Pre-rendering 65 pages for search", "Putting WhatsApp on every page"],
  },
  {
    id: "threads",
    name: "Threads Activewear",
    what: "Online store",
    where: "Beirut, Lebanon",
    year: "2026",
    outcome: "Original Nike, adidas, On and The North Face, with cash on delivery anywhere in Lebanon in one tap.",
    live: "https://threadsactivewear.com",
    liveLabel: "threadsactivewear.com",
    caseStudy: "/work/threads-activewear",
    shot: "threads",
    flagship: true,
    buildLog: ["Staging each brand on a 3D stand", "Showing live stock per brand", "Cash on delivery, all over Lebanon", "Free delivery over $100", "Shaping every page for one thumb"],
  },
  {
    id: "aria",
    name: "ARIA",
    what: "AI assistant",
    where: "Built for AHOS",
    year: "2026",
    outcome: "An AI project advisor that scopes a build, sketches a first preview and hands a warm lead to the team.",
    live: "/aria-ai",
    liveLabel: "Talk to ARIA",
    caseStudy: "/work/aria",
  },
  {
    id: "tavern",
    name: "The Tavern",
    what: "Web3 social market",
    where: "Robinhood Chain",
    year: "2026",
    outcome: "The social layer and live market for Robinhood Chain: every launch, trade and conversation in one place.",
    live: "https://www.tvern.xyz",
    liveLabel: "tvern.xyz",
    caseStudy: "/work/the-tavern",
    shot: "tavern",
  },
  {
    id: "speealigner",
    name: "SpeeAligner",
    what: "Website and case portal",
    where: "Lebanon",
    year: "2026",
    outcome: "Clear aligner planning for dental clinics: treatment plans, case submission and a 24-hour turnaround.",
    live: "https://www.speealigner.com",
    liveLabel: "speealigner.com",
    caseStudy: "/work/speealigner",
    shot: "speealigner",
  },
  {
    id: "julsauto",
    name: "Jul's Auto Repair",
    what: "Local business website",
    where: "Raynham, Massachusetts",
    year: "2025",
    outcome: "A local garage site built around one action: call the shop or get directions in one tap.",
    live: "https://julsauto.com",
    liveLabel: "julsauto.com",
    caseStudy: "/work/juls-auto-repair",
    shot: "julsauto",
  },
];

export const alsoBuilt = [
  { name: "Aleph", href: "https://www.aleph.com.lb" },
];

export interface CaseStudy {
  slug: string;
  project: string;
  title: string;
  lead: string;
  services: string[];
  /** Plain facts about the build. Keep these true. */
  facts: [string, string][];
  brief: string;
  built: { name: string; body: string }[];
  now: string;
  quote?: { text: string; name: string; role: string; link?: string };
  /** The short version shown on the homepage. Only true, checkable facts. */
  story?: {
    problem: string;
    built: string[];
    results: { v: string; l: string }[];
    note?: string;
    /** What we still need from the owner before a real business result can be shown. */
    need?: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "oman-with-issam",
    project: "issam",
    title: "A tour guide who speaks twelve languages, and a site that keeps up.",
    lead: "Issam Albalushi, the Languages Ninja, guides private tours across Oman in twelve languages. We gave him a brand-led website that welcomes every traveler in their own language and turns a visit into a WhatsApp conversation.",
    services: ["Art direction", "Interface design", "Web development", "Multilingual SEO"],
    facts: [["13", "site languages, Arabic in full right-to-left"], ["65", "pages pre-rendered for search"], ["8", "tours flown on a real satellite map"]],
    brief:
      "Travelers find Issam from everywhere: Germany, Russia, China, the Gulf. The site had to greet each of them in their language, show who Issam is in seconds, and make asking for a tour as easy as sending a message.",
    built: [
      { name: "A hero with a person in it", body: "Issam stands in front of his own name, with a greeting that changes language as you watch. You know who you are traveling with before you read a word." },
      { name: "Routes you can fly", body: "Every tour is drawn on real satellite imagery and road data. Scroll, and the camera flies the route from Muscat to the dunes." },
      { name: "Thirteen languages, done properly", body: "Each locale has its own URLs, its own metadata and full right-to-left Arabic, all pre-rendered so search engines and AI assistants can read every page." },
      { name: "One way to book", body: "WhatsApp and a short tour request form, on every page. No accounts, no checkout, no friction." },
    ],
    now: "The site is live at omanwithissam.com and is the first thing travelers see when they look Issam up.",
    story: {
      problem: "Travelers find Issam from everywhere, and each one expects to be greeted in their own language.",
      built: [
        "A hero with Issam in it, greeting you in a new language as you watch.",
        "Eight tours drawn on real satellite imagery, so you can fly each route.",
        "Thirteen languages with their own addresses, Arabic in full right-to-left.",
      ],
      results: [
        { v: "94", l: "mobile Lighthouse performance" },
        { v: "100", l: "accessibility, best practices and SEO" },
        { v: "13", l: "languages, each with its own pages" },
      ],
      note: "Mobile Lighthouse, measured 13 November 2026.",
      need: "a real result, such as tour requests since launch. GA4 is not live on omanwithissam.com yet",
    },
  },
  {
    slug: "threads-activewear",
    project: "threads",
    title: "An activewear store that moves as fast as its customers.",
    lead: "Threads sells original Nike, adidas, On and The North Face from Wadi Chahrour, Beirut. We built a store with the energy of the brands on its shelves, and a checkout that works the way Lebanon pays.",
    services: ["Brand-led design", "E-commerce", "3D and motion", "Local payments"],
    facts: [["4", "global brands, all original"], ["1 tap", "cash on delivery anywhere in Lebanon"], ["Free", "delivery on orders over $100"]],
    brief:
      "Shoppers in Lebanon want proof that what they buy is original, and most of them pay at the door. The store had to look as sharp as a brand flagship and still make cash on delivery the obvious way to order.",
    built: [
      { name: "A flagship first screen", body: "A 3D brand stage in Threads green that cycles through each brand with live stock counts, so the first thing you see is what is actually on the shelf." },
      { name: "Checkout for Lebanon", body: "Cash on delivery all over the country, free delivery over $100, and a WhatsApp button on every page for people who would rather just ask." },
      { name: "Built for phones", body: "Most orders come from a phone on mobile data, so every page is shaped for one thumb and loads fast on a weak connection." },
    ],
    now: "The store is live at threadsactivewear.com, alongside the shop in Wadi Chahrour.",
  },
  {
    slug: "aria",
    project: "aria",
    title: "ARIA, an AI advisor that does our first call for us.",
    lead: "We designed and built ARIA to do what we do on a first call: understand what someone wants to make, point them at the right next step, and pass the details to a real person.",
    services: ["AI assistant", "Conversation design", "Lead capture", "Serverless backend"],
    facts: [["24/7", "straight answers about scope, price and timing"], ["Live", "preview of your idea, sketched beside the chat"], ["Queued", "leads resend themselves if the connection drops"]],
    brief:
      "Most people who visit a studio site are not ready to book a call. They have a question about scope, price or timing. We wanted them to get a straight answer straight away, and we wanted the team to hear about it.",
    built: [
      { name: "A real conversation", body: "ARIA asks what you are building, who it is for and what you need it to do, then gives honest guidance on scope, timeline and the right service." },
      { name: "A preview on the spot", body: "When it has enough to go on, ARIA sketches a rough first screen of your idea, right next to the chat." },
      { name: "Leads that reach a person", body: "When you are ready, ARIA hands your details to the team. If the connection drops, it queues the message and sends it the next time you visit." },
      { name: "A backend that stays up", body: "A small serverless worker with retries and a fallback model, so ARIA answers even when one provider has a bad day." },
    ],
    now: "ARIA runs on this site. It is also the starting point for the assistants and WhatsApp flows we build for clients.",
  },
  {
    slug: "the-tavern",
    project: "tavern",
    title: "The Tavern, where Robinhood Chain gathers.",
    lead: "The Tavern is a social network fused with a market terminal, scoped entirely to Robinhood Chain. We designed and built the product that pours every launch, trade and conversation into one live room.",
    services: ["Product design", "Web3 development", "Real-time data", "Wallet sign-in"],
    facts: [["Live", "launches, trades and prices off the chain"], ["Gasless", "wallet sign-in, no email or password"], ["1", "chain, no global crypto noise"]],
    brief:
      "Traders on a new chain were jumping between explorers, chat groups and charts. The Tavern had to put the market and the conversation in the same place and feel alive the second you land.",
    built: [
      { name: "The tape", body: "Every buy and sell on the chain streams live, with a filter that shows only the whales." },
      { name: "Live launches and markets", body: "New tokens hit the feed the moment they mint, and a screener quotes price, volume and liquidity straight off the pools." },
      { name: "Social first", body: "Posts, replies, polls and communities, where every $ticker links to its live asset page." },
      { name: "Your wallet is your account", body: "Gasless sign-in with the wallet you already use. No email, no password." },
    ],
    now: "The Tavern is live at tvern.xyz.",
  },
  {
    slug: "speealigner",
    project: "speealigner",
    title: "A clinic-facing site for a clear aligner lab.",
    lead: "SpeeAligner plans clear aligner treatments for dental clinics. We designed and built the site clinics use to understand the service and send their first case.",
    services: ["Interface design", "Web development", "Technical SEO"],
    facts: [["3", "lines that say what the lab does"], ["24h", "turnaround, stated where clinics decide"], ["1 tap", "to submit a case, from any page"]],
    brief:
      "Clinics needed to see, in a few seconds, what SpeeAligner does, how fast it turns a case around, and how to submit one. The old route was a phone call and a lot of back and forth.",
    built: [
      { name: "One promise, three lines", body: "A first screen that says what the lab does in three short lines, with case submission one tap away on every page." },
      { name: "Case submission", body: "A guided path for clinics to send a case, with the 24-hour turnaround stated where the decision is made." },
      { name: "Fast on any connection", body: "Static pages, sized images and clean structure, so it loads quickly on clinic Wi-Fi and ranks for the searches that matter." },
    ],
    now: "The client runs the site comfortably on their own, and clinics reach submission without a phone call first.",
    quote: {
      text: "I'm grateful for the team at AHOS, they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!",
      name: "Yorgo",
      role: "SpeeAligner, Lebanon",
      link: "https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18",
    },
  },
  {
    slug: "juls-auto-repair",
    project: "julsauto",
    title: "A garage website built around one phone call.",
    lead: "Jul's Auto Repair is an independent garage in Raynham, Massachusetts. We built a site that gets a driver with a problem on the phone with the shop as fast as possible.",
    services: ["Web design", "Web development", "Local SEO"],
    facts: [["1 tap", "to call the shop"], ["1 tap", "to get directions"], ["0", "forms between a driver and a mechanic"]],
    brief:
      "People look up a garage when something is already wrong. They want to know the shop is real, close and open, and then they want to call.",
    built: [
      { name: "Call first", body: "The phone number and a directions button sit in the first screen and stay one tap away as you scroll." },
      { name: "Trust at a glance", body: "A real photo of the shop, the services in plain words and the numbers that matter, without a wall of text." },
      { name: "Found locally", body: "Clean structure and local business data, so the shop shows up for drivers searching nearby." },
    ],
    now: "The site is live at julsauto.com and does one job well: it gets the phone ringing.",
  },
];

/* ------------------------------------------------------------------ */
/* Services and pricing                                                */
/* ------------------------------------------------------------------ */

export interface Offer { name: string; body: string; tags: string[] }
export interface QA { q: string; a: string }

export interface Service {
  slug: string;
  href: string;
  label: string;
  short: string;
  blurb: string;
  from: number;
  timeline: string;
  group: "web" | "software" | "ai" | "design";
  seo: { title: string; description: string; schemaName: string };
  h1: string;
  lead: string;
  problem: string;
  offers: Offer[];
  proofProject?: string;
  faqs: QA[];
}

export const services: Service[] = [
  {
    slug: "web-development",
    href: "/web-development",
    label: "Web development",
    short: "Websites",
    blurb: "Fast, search-ready websites that turn visitors into enquiries.",
    from: 300,
    timeline: "1 to 4 weeks",
    group: "web",
    seo: {
      title: "Web Development Company in Lebanon | Custom Websites | AHOS",
      description: "AHOS designs and builds custom websites in Beirut, Lebanon: fast, search-ready and easy to update. Fixed quote, and you own the code. Serving the Gulf, Europe and the US.",
      schemaName: "Web Development",
    },
    h1: "Websites that earn their keep.",
    lead: "Designed screen by screen, then built from scratch: fast, sharp, easy to update, and wired to turn visitors into customers. No templates, no lock-in.",
    problem: "A template site quietly costs you customers every day it is live. It loads slowly, breaks on a phone and gives nobody a reason to trust you. We build the opposite.",
    offers: [
      { name: "Custom websites and landing pages", body: "Designed around your brand and what you need the site to do, from a one-page launch to a full company site. A CMS when you want to edit it yourself.", tags: ["Landing pages", "Company sites", "Portfolios", "CMS"] },
      { name: "Web apps and portals", body: "Dashboards, client portals and booking systems: the tools your team and customers open every day. React and Node, with monitoring that keeps them running.", tags: ["Dashboards", "Portals", "Booking"] },
      { name: "Search and speed, built in", body: "Technical SEO, clean structure and Core Web Vitals from the first line, so search engines have every reason to send people your way.", tags: ["Technical SEO", "Core Web Vitals", "Accessibility"] },
    ],
    proofProject: "issam",
    faqs: [
      { q: "How much does a website cost?", a: "Landing pages start at $300 and multi-page company sites at about $500. You get one fixed price in writing after a free call." },
      { q: "How long until my site is live?", a: "A landing page takes about one to two weeks, a full site two to four. Most of it depends on how ready your content is, and we tell you honestly before we start." },
      { q: "Do I own it?", a: "Yes. The code, the design and the content are yours on delivery. Host it with us or take it anywhere." },
    ],
  },
  {
    slug: "ecommerce-development",
    href: "/ecommerce-development",
    label: "Online stores",
    short: "Stores",
    blurb: "Shopify or custom stores with cash on delivery and WhatsApp ordering.",
    from: 500,
    timeline: "2 to 6 weeks",
    group: "web",
    seo: {
      title: "E-Commerce Development in Lebanon | Shopify and Custom Stores | AHOS",
      description: "AHOS builds online stores in Lebanon on Shopify, WooCommerce and custom platforms, with cash on delivery, WhatsApp ordering and fast checkout. Fixed quote, full ownership.",
      schemaName: "E-Commerce Development",
    },
    h1: "Stores built to sell.",
    lead: "Shopify, WooCommerce or fully custom, tuned for checkout speed and the way your customers actually pay: card, cash on delivery or a WhatsApp message.",
    problem: "Most stores leak money at checkout: a slow page, one confusing step, a payment method someone does not trust. We find the leaks and close them.",
    offers: [
      { name: "Shopify stores", body: "Custom Shopify builds with a theme that is yours, plus multi-currency, subscriptions and only the apps you need.", tags: ["Shopify", "Shopify Plus", "Subscriptions"] },
      { name: "Custom and WooCommerce", body: "Self-hosted stores with full code ownership, or a custom platform when your catalogue, pricing or delivery is unusual.", tags: ["WooCommerce", "Custom builds", "Marketplaces"] },
      { name: "Checkout and local payments", body: "Cash on delivery, local gateways, WhatsApp ordering and abandoned-cart recovery, set up where buyers expect them.", tags: ["Cash on delivery", "WhatsApp", "Payments"] },
      { name: "Migration and care", body: "Move from another platform without losing products, rankings or history, then keep it running on busy sales days.", tags: ["Migrations", "Redirects", "Care plans"] },
    ],
    proofProject: "threads",
    faqs: [
      { q: "How much does an online store cost?", a: "Stores start at $500 for a standard build. A custom store with a larger catalogue and integrations is quoted on the call. The price is fixed in writing." },
      { q: "How long does it take to launch?", a: "Most stores go live in two to six weeks, depending on product count, integrations and whether we are migrating an existing store." },
      { q: "Can you migrate my existing store?", a: "Yes. We move products, customers and order history and map every redirect so you keep your rankings." },
    ],
  },
  {
    slug: "mobile-app-development",
    href: "/mobile-app-development",
    label: "Mobile apps",
    short: "Apps",
    blurb: "iOS and Android apps people keep on their home screen.",
    from: 1000,
    timeline: "6 to 12 weeks",
    group: "software",
    seo: {
      title: "Mobile App Development in Lebanon | iOS and Android | AHOS",
      description: "AHOS designs and builds iOS, Android and cross-platform apps in Beirut, from first drawing to the App Store. Fixed quote, full code ownership.",
      schemaName: "Mobile App Development",
    },
    h1: "Apps people keep opening.",
    lead: "From concept to the App Store and Google Play. We design the flow before we write platform code, so the app feels right the first time someone opens it.",
    problem: "A clunky app gets one chance. A slow screen or a confusing flow and it is gone from the home screen. We build the kind that stays.",
    offers: [
      { name: "Native iOS and Android", body: "Swift and Kotlin apps that feel right on each platform, with push, in-app purchases and store compliance handled.", tags: ["Swift", "Kotlin", "Push"] },
      { name: "Cross-platform", body: "One codebase for both stores with Flutter or React Native, and platform polish where it counts.", tags: ["Flutter", "React Native"] },
      { name: "Backends for mobile", body: "Auth, real-time data and notifications that make the app feel instant, built to grow with it.", tags: ["Auth", "Realtime", "Cloud"] },
    ],
    faqs: [
      { q: "How much does a mobile app cost?", a: "Apps start at $1,000 and scale with features, platforms and backend. You get a fixed quote after a free call." },
      { q: "How long does it take?", a: "Most apps take six to twelve weeks from first drawing to store submission." },
      { q: "iOS, Android or both?", a: "Whichever fits your users and budget: native Swift and Kotlin, or one cross-platform codebase. We handle store submission too." },
    ],
  },
  {
    slug: "custom-software",
    href: "/custom-software",
    label: "Custom software",
    short: "Software",
    blurb: "Dashboards, platforms and internal tools shaped around how you work.",
    from: 1500,
    timeline: "6 to 16 weeks",
    group: "software",
    seo: {
      title: "Custom Software Development Company in Lebanon | AHOS",
      description: "AHOS builds SaaS platforms, dashboards, APIs and internal tools in Beirut, shaped around how your business runs. Fixed quote, milestones, full ownership.",
      schemaName: "Custom Software Development",
    },
    h1: "Software shaped around your business.",
    lead: "Off-the-shelf tools make you bend to their logic. We build platforms, dashboards and internal tools around how your team already works.",
    problem: "Every workaround, spreadsheet and copy-paste job is a tax your team pays daily. Custom software pays it back.",
    offers: [
      { name: "SaaS platforms", body: "Multi-tenant products with billing, roles and usage analytics, deployed with CI and kept reliable in production.", tags: ["Multi-tenant", "Billing", "Roles"] },
      { name: "Dashboards and internal tools", body: "Admin panels, CRMs and reporting wired into the systems you already use.", tags: ["Admin", "CRM", "Reporting"] },
      { name: "APIs and integrations", body: "REST and GraphQL APIs, webhooks and data sync that connect your payments, CRM and marketing tools into one flow.", tags: ["REST", "GraphQL", "Webhooks"] },
    ],
    proofProject: "tavern",
    faqs: [
      { q: "How much does custom software cost?", a: "Custom software starts at $1,500 and scales with scope. You get a fixed price after a free call, never an open hourly bill." },
      { q: "How long does it take?", a: "Platforms usually take six to sixteen weeks. We work in milestones, so you use working software throughout." },
      { q: "Will I own the source code?", a: "Yes. All code, architecture and IP are yours on delivery." },
    ],
  },
  {
    slug: "ai-development",
    href: "/ai-development",
    label: "AI and automation",
    short: "AI",
    blurb: "Assistants and WhatsApp flows that take repetitive work off your team.",
    from: 500,
    timeline: "Scoped on the call",
    group: "ai",
    seo: {
      title: "AI Development Company in Lebanon | AI and Automation | AHOS",
      description: "AHOS builds AI assistants, WhatsApp flows and workflow automation in Beirut that answer customers, take orders and save your team hours every week.",
      schemaName: "AI Development",
    },
    h1: "AI that does the work.",
    lead: "Assistants, automations and WhatsApp flows that answer customers, qualify leads and handle the repetitive jobs, tuned for the task instead of bolted on.",
    problem: "Most AI projects fail because they start with the technology, not the problem. We start with the hours your team is losing.",
    proofProject: "aria",
    offers: [
      { name: "Assistants and chat", body: "Assistants trained on your business that answer real questions and hand off to a person at the right moment. ARIA on this site is one we built.", tags: ["Assistants", "Lead capture", "Handoff"] },
      { name: "WhatsApp flows", body: "Ordering, booking and support on the channel your customers already use.", tags: ["WhatsApp Business", "Ordering", "Support"] },
      { name: "Workflow automation", body: "Email triage, document extraction, lead scoring and reports, done without anyone copying and pasting.", tags: ["Extraction", "Scoring", "Reports"] },
    ],
    faqs: [
      { q: "How much does an AI tool cost?", a: "AI tools and automations start at $500 and scale with complexity. Fixed price after a free call." },
      { q: "What can AI automate for my business?", a: "Anything repetitive and rules-heavy: support routing, data extraction, lead scoring, order intake and internal questions." },
      { q: "Which models do you use?", a: "Whichever fits the job and the budget. We build around outputs you can test and trust." },
    ],
  },
  {
    slug: "ui-ux-design",
    href: "/ui-ux-design",
    label: "Interface and brand design",
    short: "Design",
    blurb: "Interfaces, identities and design systems that look like you meant it.",
    from: 200,
    timeline: "1 to 4 weeks",
    group: "design",
    seo: {
      title: "UI/UX and Brand Design in Lebanon | Web and Mobile | AHOS",
      description: "AHOS designs interfaces, brand identities and design systems in Beirut, from research to production-ready Figma files your developers can build from.",
      schemaName: "UI/UX Design",
    },
    h1: "Design that is hard to ignore.",
    lead: "Interfaces, identities and design systems that communicate clearly and convert consistently, specified so developers can build them without guessing.",
    problem: "People decide whether to trust you in the first few seconds, long before they read a word. Design wins or loses that moment.",
    proofProject: "issam",
    offers: [
      { name: "Interface design", body: "Research, wireframes, high-fidelity screens and prototypes in Figma, with specs ready to build.", tags: ["Research", "Figma", "Prototypes"] },
      { name: "Brand identity and systems", body: "Logo, colour, type and a design system that keeps every screen consistent.", tags: ["Identity", "Design system", "Guidelines"] },
      { name: "Redesigns", body: "A UX audit and a modern redesign for a site or app that has outgrown its look. Hand it to your team or have us build it.", tags: ["UX audit", "Redesign"] },
    ],
    faqs: [
      { q: "How much does design cost?", a: "Design work starts at $200, from a single landing page to a full identity and system. Fixed price after a free call." },
      { q: "What do I get?", a: "Figma files, prototypes and production specs, plus brand assets and a design system where it applies." },
      { q: "Can you redesign my existing product?", a: "Yes. We audit it, restructure it and deliver a redesign you can hand to developers or have us build." },
    ],
  },
  {
    slug: "web3",
    href: "/web3",
    label: "Web3 and blockchain",
    short: "Web3",
    blurb: "Smart contracts, dapps and launches with a Web2-quality interface.",
    from: 2500,
    timeline: "Scoped on the call",
    group: "software",
    seo: {
      title: "Web3 and Blockchain Development in Lebanon | Dapps and DeFi | AHOS",
      description: "AHOS builds audited smart contracts, dapps, token and NFT launches and DeFi interfaces in Beirut, with an interface people actually understand.",
      schemaName: "Web3 and Blockchain Development",
    },
    h1: "Your chain. Our build.",
    lead: "Smart contracts, dapps, token and NFT launches and DeFi interfaces under one roof, audited where it counts and clear where it shows.",
    problem: "In Web3, one unaudited line or one clumsy wallet flow can sink a launch. We sweat both.",
    proofProject: "tavern",
    offers: [
      { name: "Smart contracts", body: "Tokens, NFTs, DAOs and DeFi logic, gas-optimised and audited before mainnet.", tags: ["ERC-20", "ERC-721", "DAO"] },
      { name: "Dapps and wallets", body: "MetaMask, WalletConnect and on-chain data behind an interface as clean as a modern web app.", tags: ["MetaMask", "WalletConnect"] },
      { name: "Launches", body: "Minting, staking and allowlists, from zero to mint without launch-day panic.", tags: ["Minting", "Staking", "Allowlists"] },
    ],
    faqs: [
      { q: "How much does a Web3 project cost?", a: "Web3 projects start at $2,500 and scale with scope. Fixed price after a free call." },
      { q: "Do you audit smart contracts?", a: "Yes. Contracts are tested and audited before any mainnet deployment." },
      { q: "Can you handle the whole launch?", a: "Yes: contracts, frontend, wallets and launch mechanics, under one roof." },
    ],
  },
];

/** The three groups shown on the homepage. */
export const serviceGroups = [
  { name: "Websites and online stores", body: "For businesses that need to be found and to sell. Custom or Shopify, fast on a phone, with cash on delivery and WhatsApp ordering where your customers expect them.", time: "1 to 6 weeks", links: ["web-development", "ecommerce-development"] },
  { name: "Apps and custom software", body: "iOS and Android apps, dashboards, portals and internal tools, shaped around how your business already runs.", time: "6 to 16 weeks", links: ["mobile-app-development", "custom-software"] },
  { name: "AI and automation", body: "Assistants like ARIA and WhatsApp flows that answer customers, take orders and handle the repetitive work.", time: "2 to 6 weeks", links: ["ai-development"] },
  { name: "Design, brand and Web3", body: "Interfaces and identities that make people trust you, and Web3 products with an interface people actually understand.", time: "1 to 8 weeks", links: ["ui-ux-design", "web3"] },
];

export const pricing = {
  promise: "Every project gets a fixed quote in writing after a free 30-minute call. No hourly meter.",
  included: [
    { name: "A fixed quote", body: "The scope, the milestones and the price, in writing, before work starts." },
    { name: "Milestone payments", body: "Usually half up front and half at launch. Larger builds split into three." },
    { name: "You own everything", body: "Code, designs and content are yours on delivery. No licence to keep paying." },
    { name: "30-day warranty", body: "Anything that breaks in the first 30 days after launch, we fix at no cost." },
    { name: "Hosting at cost", body: "We set it up for you. Ongoing hosting usually runs $5 to $15 a month." },
    { name: "Care plans", body: "Updates, monitoring and a monthly block of improvements, if you want them." },
  ],
  faqs: [
    { q: "Why start-from prices and not packages?", a: "Because no two projects are the same size. The start-from price tells you where we begin; the call tells us what you need, and the quote fixes it." },
    { q: "What changes the price?", a: "The number of screens or pages, integrations such as payments or a CRM, content and copywriting, and how soon you need it." },
    { q: "Do you offer payment plans?", a: "Yes. We work in milestones, typically 50% up front and 50% at launch. Larger builds can split into three payments." },
    { q: "What if I need changes after launch?", a: "Every build includes 30 days of fixes. After that, a care plan or per-task work, whichever suits you." },
  ] as QA[],
};

/* ------------------------------------------------------------------ */
/* Process, studio, FAQ, careers                                       */
/* ------------------------------------------------------------------ */

export const process = [
  { name: "A 30-minute call", body: "Free. You tell us what you are building, we ask the questions that shape it.", time: "Day 1" },
  { name: "A plan and a fixed quote", body: "In writing: what we will make, the milestones, the price.", time: "Within 24 hours" },
  { name: "The design", body: "Every screen designed before code is written. You see exactly what you are getting, and sign it off.", time: "1 to 2 weeks" },
  { name: "The build", body: "Built by the people who designed it, with a working preview at every milestone.", time: "2 to 10 weeks" },
  { name: "Launch", body: "Live, fast and yours: code, designs and content. Then a 30-day warranty.", time: "Launch day" },
];

export const homeFaq: QA[] = [
  { q: "What does AHOS do?", a: "AHOS is a design and engineering studio in Beirut, Lebanon. One team designs and builds websites, online stores, mobile apps, custom software, AI assistants and Web3 products for businesses in Lebanon, the Gulf, Europe and the US." },
  { q: "How long does it take to build a website or app?", a: "A landing page takes about one to two weeks, a full website or online store two to four weeks, and a mobile app or custom platform usually six to twelve weeks. You get a timeline in writing before work starts." },
  { q: "Do I own the code and design?", a: "Yes. On delivery you own all source code, designs and content. There is no lock-in and no licence you have to keep paying for." },
  { q: "How does pricing work?", a: "Every project gets a fixed quote in writing after a free 30-minute call, with payments split into milestones. There is no hourly billing." },
  { q: "Can you work with clients outside Lebanon?", a: "Yes. Most of our work runs remotely, with clients across Lebanon, the Gulf, Europe and the United States. We work in English, Arabic and French." },
  { q: "What happens after launch?", a: "Every build includes a 30-day warranty. After that, care plans cover hosting, updates, monitoring and a monthly block of improvements." },
];

export const faqCategories: { name: string; items: QA[] }[] = [
  {
    name: "The studio",
    items: [
      homeFaq[0],
      { q: "Where is AHOS based?", a: "In Beirut, Lebanon. Most projects run remotely, so we work with clients across Lebanon, the Gulf, Europe and the US, in English, Arabic and French." },
      { q: "What industries do you work with?", a: "Retail and e-commerce, healthcare, transport, local services, restaurants, real estate, finance and SaaS. The process is the same; the design is specific to you." },
      { q: "Who will I work with?", a: "A small senior team. The people who design your product are the people who build it, and you talk to them directly." },
    ],
  },
  {
    name: "Projects and timelines",
    items: [
      homeFaq[1],
      { q: "Do you build online stores?", a: "Yes, on Shopify, WooCommerce or a custom platform, with cash on delivery, local payment gateways and WhatsApp ordering where your customers expect them." },
      { q: "Are your sites fast and mobile-friendly?", a: "Yes. We design for phones first and build for Core Web Vitals, accessibility and search from the first line of code." },
      { q: "Can you redesign an existing site?", a: "Yes. We audit what you have, keep what works, and move your content and URLs across without losing rankings." },
      { q: "What tech do you use?", a: "Whatever fits the job. Usually React, TypeScript, Node, Postgres and Shopify on the web, and Swift, Kotlin, Flutter or React Native for apps." },
    ],
  },
  {
    name: "Pricing and ownership",
    items: [
      homeFaq[3],
      { q: "What are your starting prices?", a: "Design from $200, websites from $300, online stores and AI tools from $500, mobile apps from $1,000, custom software from $1,500 and Web3 from $2,500. Your quote is fixed after the call." },
      homeFaq[2],
      homeFaq[5],
    ],
  },
  {
    name: "Getting started",
    items: [
      { q: "How do I start?", a: "Book a 30-minute call, send a WhatsApp, or write to info@ahos.xyz. A real person replies within 24 hours with next steps." },
      { q: "How fast do you reply?", a: "Within 24 hours on working days, often within a few hours. If it is urgent, say so and we will prioritise it." },
      homeFaq[4],
    ],
  },
];

export const careers = {
  h1: "We hire rarely. And well.",
  lead: "We stay small on purpose. When we bring someone in, it is someone who would rather own a hard problem than be handed an easy one.",
  values: [
    { name: "Own the whole thing", body: "No ticket pushing. You take a problem from blank page to shipped, and your name is on it." },
    { name: "Remote, async, adult", body: "Work where you think best. We care about what you ship, not when your status light is green." },
    { name: "Real work, fast", body: "Small team, short chains. Your work reaches real users in weeks." },
    { name: "Range over silos", body: "Curiosity across web, software and design is the point of a studio." },
  ],
  roles: [
    { name: "Full-stack developer", stack: "React, TypeScript, Node, Postgres" },
    { name: "Product and brand designer", stack: "Interface, identity, motion" },
    { name: "Web3 engineer", stack: "Solidity, EVM, dapps" },
    { name: "Motion and video artist", stack: "After Effects, 3D, editing" },
  ],
};

/* ------------------------------------------------------------------ */
/* Routes and SEO                                                      */
/* ------------------------------------------------------------------ */

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  crumb?: string;
  priority: number;
  noindex?: boolean;
}

const servicesRoutes: RouteMeta[] = services.map((s) => ({
  path: s.href,
  title: s.seo.title,
  description: s.seo.description,
  crumb: s.label,
  priority: 0.9,
}));

const caseRoutes: RouteMeta[] = caseStudies.map((c) => {
  const p = projects.find((x) => x.id === c.project)!;
  return {
    path: `/work/${c.slug}`,
    title: `${p.name} case study: ${p.what} | AHOS`,
    description: `${c.lead} Designed and built by AHOS in Beirut.`,
    crumb: p.name,
    priority: 0.8,
  };
});

export const routes: RouteMeta[] = [
  { path: "/", title: "AHOS | Design and Engineering Studio in Beirut: Websites, Apps and AI", description: "AHOS is a design and engineering studio in Beirut, Lebanon. We design and build websites, online stores, mobile apps, AI assistants and custom software for businesses in Lebanon, the Gulf, Europe and the US. Fixed quotes, and you own the code.", priority: 1 },
  { path: "/services", title: "Services | Websites, Stores, Apps, Software and AI | AHOS", description: "Everything AHOS designs and builds in Beirut: websites, online stores, mobile apps, custom software, AI automation, interface design and Web3, each with a start-from price.", crumb: "Services", priority: 0.9 },
  { path: "/work", title: "Case Studies | Websites, Stores, Apps and AI by AHOS", description: "Case studies from AHOS, a design and engineering studio in Beirut: Oman with Issam, Threads Activewear, ARIA, The Tavern, SpeeAligner and Jul's Auto Repair. What we were asked, what we built and where it is now.", crumb: "Work", priority: 0.9 },
  ...servicesRoutes,
  ...caseRoutes,
  { path: "/pricing", title: "Pricing | Fixed Quotes, Start-From Prices | AHOS Beirut", description: "AHOS pricing: design from $200, websites from $300, stores and AI from $500, apps from $1,000, custom software from $1,500. Every project gets a fixed quote in writing.", crumb: "Pricing", priority: 0.8 },
  { path: "/faq", title: "FAQ | Timelines, Pricing and Ownership | AHOS", description: "Straight answers about working with AHOS: timelines, fixed pricing, code ownership, support after launch and working with clients outside Lebanon.", crumb: "FAQ", priority: 0.7 },
  { path: "/contact", title: "Start a Project | Book a 30-Minute Call | AHOS", description: "Tell AHOS what you are building. A real person replies within 24 hours with a plan and a fixed quote. WhatsApp, email or a 30-minute call.", crumb: "Contact", priority: 0.8 },
  { path: "/careers", title: "Careers | Join a Small Senior Studio in Beirut | AHOS", description: "AHOS hires rarely and well. Developers, designers and engineers who would rather own a hard problem than be handed an easy one.", crumb: "Careers", priority: 0.5 },
  { path: "/aria-ai", title: "ARIA | AI Project Advisor | AHOS", description: "Talk to ARIA, the AI project advisor AHOS designed and built. Describe what you want to make and get honest guidance on scope, timeline and next steps.", crumb: "ARIA", priority: 0.6 },
];

export const routeFor = (path: string): RouteMeta | undefined => {
  const clean = path.split("?")[0].replace(/\/+$/, "") || "/";
  return routes.find((r) => r.path === clean);
};

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const projectById = (id: string) => projects.find((p) => p.id === id)!;
/** Deploy base path ("" in production, "/ahos-preview" for the preview build). */
export const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
/** Prefix a public asset or plain href with the deploy base. */
export const asset = (p: string) => `${BASE}${p}`;
export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
