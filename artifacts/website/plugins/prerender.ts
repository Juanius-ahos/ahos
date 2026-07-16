import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { Plugin } from "vite";

interface RouteMeta {
  title: string;
  description: string;
  ogImage?: string;
  bodyHtml: string;
  jsonLd?: string;
  faqJsonLd?: string;
}

const SITE_URL = "https://ahos.xyz";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const ORG_JSON_LD = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "${SITE_URL}/#organization",
      "name": "Advanced Hybrid Online Systems",
      "alternateName": "AHOS",
      "url": "${SITE_URL}",
      "logo": "${SITE_URL}/logo.png",
      "email": "info@ahos.xyz",
      "telephone": "+961 70 165 601",
      "description": "AHOS is a web development and digital design studio based in Beirut, Lebanon building premium websites, custom software, AI tools, Web3 platforms, and brand identities for clients in the US and worldwide.",
      "address": { "@type": "PostalAddress", "streetAddress": "Beirut Digital District", "addressLocality": "Beirut", "addressRegion": "Beirut", "addressCountry": "LB" },
      "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" }],
      "priceRange": "$$",
      "areaServed": [{"@type":"Country","name":"Lebanon"},{"@type":"Country","name":"United States"},{"@type":"AdministrativeArea","name":"Worldwide"}],
      "knowsAbout": ["Web Development","Custom Software","SaaS","Web3","Smart Contracts","Blockchain","Artificial Intelligence","Automation","Brand Identity","UI/UX Design","E-commerce","Mobile App Development"],
      "sameAs": ["https://www.instagram.com/ahos.xyz/","https://www.linkedin.com/company/ahos-xyz","https://www.youtube.com/@ahos_xyz"]
    },
    {
      "@type": "WebSite",
      "@id": "${SITE_URL}/#website",
      "url": "${SITE_URL}",
      "name": "AHOS — Web Development Agency in Lebanon | AI & Digital Design Studio",
      "description": "AHOS is a web development and digital design studio in Beirut, Lebanon building premium websites, custom software, AI tools, and Web3 platforms for clients in the US and worldwide.",
      "publisher": { "@id": "${SITE_URL}/#organization" }
    }
  ]
}`;

const SERVICE_JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Service",
      "name": "Custom Software Development",
      "description": "SaaS platforms, web apps, dashboards, automation, and API integration — built to your workflow, from first sketch to deployed product.",
      "provider": { "@id": "${SITE_URL}/#organization" }
    },
    {
      "@type": "Service",
      "name": "Web Development",
      "description": "Landing pages, corporate sites, e-commerce platforms — fast, pixel-tight, responsive, and SEO-optimised.",
      "provider": { "@id": "${SITE_URL}/#organization" }
    },
    {
      "@type": "Service",
      "name": "Media & Branding",
      "description": "Video editing, 2D animation, brand identity, style guides, and social packs — consistent, professional visuals.",
      "provider": { "@id": "${SITE_URL}/#organization" }
    },
    {
      "@type": "Service",
      "name": "Web3 & Blockchain Development",
      "description": "Smart contracts, dapps, NFT and token launches, DeFi interfaces — audited and deployed on EVM chains.",
      "provider": { "@id": "${SITE_URL}/#organization" }
    },
    {
      "@type": "Service",
      "name": "AI & Automation",
      "description": "Custom AI tools, chatbots, and workflow automations that save hours every week.",
      "provider": { "@id": "${SITE_URL}/#organization" }
    }
  ]
}`;

const FAQ_JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a website or app cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Fixed-price quotes after a free discovery call. Starting points: design from $200, websites from $300, AI tools and e-commerce from $500, mobile apps from $1,000, custom software from $1,500, and Web3 projects from $2,500, scaling with scope." }
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a website?",
      "acceptedAnswer": { "@type": "Answer", "text": "Landing pages take 1—2 weeks, business sites 2—4 weeks, e-commerce platforms 3—6 weeks. Custom software and Web3 projects vary based on scope." }
    },
    {
      "@type": "Question",
      "name": "Will I own the source code?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. You receive full ownership of all source code, assets, and IP on final delivery — no lock-in, no licensing tricks." }
    },
    {
      "@type": "Question",
      "name": "Do you offer ongoing support after launch?",
      "acceptedAnswer": { "@type": "Answer", "text": "Every project includes 30 days of post-launch support at no extra cost. Ongoing maintenance, hosting, and support packages are available." }
    },
    {
      "@type": "Question",
      "name": "How quickly do you respond to inquiries?",
      "acceptedAnswer": { "@type": "Answer", "text": "Within 24 hours on business days, often within a few hours. We reply to every inquiry personally." }
    }
  ]
}`;

const ROUTES: Record<string, RouteMeta> = {
  "/": {
    title: "Websites From $300 | Web Dev Agency Beirut Lebanon | AHOS",
    description:
      "AHOS is a web development agency in Beirut building custom websites, e-commerce stores & web apps from $300. Launch in days, not weeks. Serving clients worldwide.",
    bodyHtml: `<h1>Custom websites from $300.</h1>
<p>Landing pages, e-commerce stores, and full corporate sites — designed and shipped in days, not weeks. No templates, no hidden fees, full ownership.</p>
<p>Web development agency in Beirut, Lebanon — trusted in the US and worldwide.</p>
<section><h2>Seven capabilities, one studio.</h2>
<h3>Web Development</h3><p>Fast, pixel-tight sites built to earn their keep. Responsive on every screen, tuned for search, and ready to scale — from a single landing page to full e-commerce.</p>
<h3>Custom Software</h3><p>SaaS platforms, web apps, dashboards, automation — software shaped to how your business actually runs, from first sketch to deployed product you fully own.</p>
<h3>Mobile Apps</h3><p>Native iOS, Android, and cross-platform mobile applications designed and shipped from concept to App Store. Swift, Kotlin, Flutter, or React Native — the right stack for your product.</p>
<h3>Web3 & Blockchain</h3><p>Audited smart contracts, dapps, token launches, and DeFi interfaces. Every layer of your Web3 project under one roof.</p>
<h3>AI & Automation</h3><p>Custom AI tools, chatbots, and workflow automations. From a simple chat interface to full agent pipelines — built to save you hours every week.</p>
<h3>E-Commerce</h3><p>Shopify, WooCommerce, or fully custom stores optimized for checkout speed, conversion rate, and inventory sanity. Payment gateways, multi-currency, and full migration support.</p>
<h3>UI/UX & Brand Design</h3><p>Interfaces, brand identities, and design systems that communicate clearly and convert consistently. From user research to pixel-perfect UI — design that scales across every touchpoint.</p></section>
<section><h2>Selected work</h2><p>SpeeAligner, YourProvider, Aleph, Ido Taxi, ARIA AI — websites, mobile apps, and AI tools we've shipped.</p></section>
<section><h2>Three steps to a live product.</h2>
<h3>Discovery</h3><p>A free consultation to learn your goals, define the product, and map a clear plan with a fixed-price quote.</p>
<h3>Design & Build</h3><p>We craft your solution with clean code and sharp design — milestone updates at every stage.</p>
<h3>Launch & Support</h3><p>We deploy, monitor, and support from day one, with 24/7 availability and a 30-day warranty.</p></section>
<section><h2>No surprises. In writing.</h2><p>100% source code yours · 30 day post-launch warranty · 24h average first reply · 0 hidden fees — fixed quotes.</p></section>`,
  },
  "/services": {
    title: "Websites, Apps & AI | Full-Stack Digital Studio | AHOS",
    description:
      "Custom software, web development, and media & branding from AHOS. One team, strategy to launch, full code ownership.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Everything you need, done properly.</h1>
<p>Web development, mobile apps, custom software, AI & automation, e-commerce, and design — handled by one team that talks to itself. No agency relay race, no finger-pointing when something breaks.</p>
<section><h2>Custom Software</h2>
<p>Off-the-shelf tools make you bend to their logic. We do the opposite: software shaped to how your business actually runs, from first sketch to a deployed, scalable product you fully own.</p>
<p>SaaS Platforms · Web Apps · Dashboards · Automation · API Integration — full source-code ownership, architecture that scales with you, optional hosting and long-term support.</p></section>
<section><h2>Web Development</h2>
<p>Every site we ship is fast, pixel-tight, and built to earn its keep — responsive on every screen, tuned for search, and ready to scale. From a single landing page to full e-commerce.</p>
<p>Landing Pages · Corporate Sites · E-Commerce · Maintenance · Hosting — responsive on every device, speed and conversion optimised, scalable foundation from day one.</p></section>
<section><h2>Mobile Apps</h2>
<p>iOS, Android, or cross-platform mobile applications from concept to App Store. Swift, Kotlin, Flutter, React Native — the right stack for your product.</p></section>
<section><h2>AI & Automation</h2>
<p>Custom AI tools, chatbots, workflow automations, and LLM-powered systems that save your team hours every week. From strategy through deployment.</p></section>
<section><h2>E-Commerce</h2>
<p>Shopify, WooCommerce, or fully custom stores optimized for checkout speed and conversion. Payment gateways, multi-currency, and migration support.</p></section>
<section><h2>UI/UX & Brand Design</h2>
<p>Interfaces, brand identities, and design systems that communicate clearly and convert consistently. From user research to pixel-perfect UI.</p></section>
<p>Book a free 30-minute call. We'll listen, point you at the right move, and hand you a clear plan — no pressure, no commitment.</p>`,
  },
  "/web3": {
    title: "Web3 & Blockchain Development in Lebanon | Dapps & DeFi | AHOS",
    description:
      "AHOS builds audited smart contracts, dapps, NFT and token launches, and DeFi interfaces in Lebanon — from contracts to go-to-market. Serving the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Your chain. Our build.</h1>
<p>From contracts to creative — every layer of your Web3 project, under one roof. Audited where it counts, beautiful where it shows.</p>
<section><h2>Smart Contracts</h2><p>Tokens, NFTs, DAOs, DeFi — designed, gas-optimised, and audited before a single wei moves. ERC-20 · ERC-721/1155 · DAO Governance · DeFi Protocols · Multi-sig.</p></section>
<section><h2>Web3 Frontend & Dapps</h2><p>MetaMask, WalletConnect, Coinbase, on-chain data, marketplace flows — all behind a Web2-quality interface. Wallet Integration · Dapp UIs · Marketplaces · Chain APIs.</p></section>
<section><h2>NFT & Token Launches</h2><p>Minting platforms, staking dashboards, allowlists, reveals, marketplace listings. Zero to mint — without the launch-day panic.</p></section>
<section><h2>Creative & Media</h2><p>Trailers, motion, art direction, and a brand system that holds from Discord to OpenSea. 2D/3D · Art Direction · Brand System · Social Packs.</p></section>
<section><h2>Strategy & Advisory</h2><p>Tokenomics, whitepaper structure, go-to-market, community, and a technical roadmap with real milestones — so you launch with clarity and momentum.</p></section>
<p>Book a free 30-minute call and we'll map your full build — contracts, frontend, art, and go-to-market.</p>`,
  },
  "/careers": {
    title: "Careers | Join Our Development Studio | AHOS",
    description:
      "AHOS hires rarely and well. Developers, designers, Web3 engineers, and motion artists who'd rather own a problem than close a ticket. Apply with your CV.",
    bodyHtml: `<h1>We hire rarely. And well.</h1>
<p>We stay small on purpose. When we do bring someone in, it's someone who'd rather own a hard problem than be handed an easy one.</p>
<section><h2>No ladders to climb. Just good work to do.</h2>
<h3>Own the whole thing</h3><p>No ticket-pushing. You take a problem from blank page to shipped, and your name is on it.</p>
<h3>Remote, async, adult</h3><p>Work where you think best. We care about what you ship, not when your status light is green.</p>
<h3>Real work, fast</h3><p>Small team, short chains. Your work reaches real users in weeks, not after six months of process.</p>
<h3>Range over silos</h3><p>We're a studio, not a factory line. Curiosity across web, software, Web3, and design is the whole point.</p></section>
<section><h2>Always open to the right people</h2>
<p>Full-stack Developer (React · TypeScript · Node · Postgres) · Product & Brand Designer (UI/UX · Identity · Motion) · Web3 Engineer (Solidity · EVM · Dapps) · Motion & Video Artist (After Effects · 3D · Editing).</p></section>
<p>Don't see your role? If you're genuinely good at something we'd be lucky to have, tell us. Send your work, not a résumé template.</p>`,
  },
  "/contact": {
    title: "Start a Project | Website & App Inquiries | AHOS",
    description:
      "Tell AHOS what you're building. Name, email, and a brief description — we'll come back with a clear plan within 24 hours.",
    bodyHtml: `<h1>Tell us your idea.</h1>
<p>Name + email + a brief idea. We'll read it, think about it, and come back with a straight answer and a clear plan, usually within a day.</p>
<section><h2>What we need from you</h2>
<h3>Your name and email</h3><p>So we can reach you with the plan.</p>
<h3>Phone / WhatsApp (optional)</h3><p>For a faster reply when we're ready to talk.</p>
<h3>What are you building?</h3><p>Website, Web app/SaaS, Mobile app, Web3/DeFi, AI/Automation, Branding, or Not sure yet.</p>
<h3>Rough budget (optional)</h3><p>From under $3k to $20k+, or Not sure yet.</p>
<h3>Anything else (optional)</h3><p>A line or two about your project, timeline, or what you have in mind.</p></section>
<p>We reply within 24 hours. Email: info@ahos.xyz · WhatsApp: +961 70 165 601 · Based in Beirut — worldwide.</p>`,
  },
  "/aria-ai": {
    title: "ARIA AI | Free Project Advisor Chatbot | AHOS",
    description:
      "Chat with ARIA, the AHOS AI project advisor. Describe what you want to build and get instant, honest guidance — scope, timeline, and next steps.",
    bodyHtml: `<h1>Meet ARIA.</h1>
<p>Your AI project advisor. Describe what you want to build and get instant, honest advice — scope, timeline, and next steps. No form, no sales pitch.</p>
<p>ARIA is a senior project advisor at AHOS — a boutique digital studio building websites, mobile apps, SaaS, Web3/DeFi, and AI tools. She helps visitors understand what is possible, gives honest advice, and has real conversations about your project.</p>
<section><h2>Services ARIA can advise on</h2><p>Websites · Mobile Apps · SaaS Platforms · Web3/DeFi · AI Tools · E-commerce · Brand Design</p></section>
<section><h2>Typical project timelines</h2><p>Landing pages: 1—2 weeks · Business sites: 2—4 weeks · Apps: 4—10 weeks · SaaS: 6—16 weeks · Web3/AI: 6—20 weeks</p></section>
<p>AHOS works on fixed-price quotes, milestone payments, 100% code ownership, and 30-day post-launch support.</p>`,
  },
  "/faq": {
    title: "FAQ — Pricing, Process & Timelines | Web Development | AHOS",
    description:
      "Straight answers about how AHOS works — services, timelines, pricing, code ownership, Web3, AI, and support. No jargon.",
    jsonLd: FAQ_JSON_LD,
    bodyHtml: `<h1>No fluff. Straight answers.</h1>
<p>Everything people actually ask before they hit "start a project." Can't find it? Email us — a human replies.</p>
<section><h2>General</h2>
<h3>What is AHOS?</h3><p>AHOS (Advanced Hybrid Online Systems) is a boutique digital product studio that builds websites, custom software, mobile apps, Web3/DeFi platforms, AI tools, and brand identities. We handle everything from strategy to launch under one roof.</p>
<h3>How much does a website or app cost?</h3><p>Fixed-price quotes after a free discovery call. Starting points: design from $200, websites from $300, AI tools and e-commerce from $500, mobile apps from $1,000, custom software from $1,500, and Web3 projects from $2,500, scaling with scope.</p>
<h3>How long does it take to build a website?</h3><p>Landing pages 1—2 weeks, business sites 2—4 weeks, e-commerce 3—6 weeks. Custom software and Web3 projects vary.</p>
<h3>Will I own the source code?</h3><p>Yes. Full ownership of all source code, assets, and IP on final delivery — no lock-in, no licensing tricks.</p>
<h3>Do you offer ongoing support after launch?</h3><p>Every project includes 30 days of post-launch support at no extra cost. Ongoing maintenance, hosting, and support packages available.</p></section>
<section><h2>Web Development</h2>
<h3>Do you build e-commerce websites?</h3><p>Yes. Full platforms with product management, payment processing, booking, user accounts, and admin dashboards.</p>
<h3>Are your websites mobile-friendly?</h3><p>Absolutely. Fully responsive across all devices. Mobile-first design approach.</p>
<h3>Do you optimise websites for search engines?</h3><p>Yes. SEO built-in: semantic HTML, heading hierarchy, meta tags, structured data (JSON-LD), fast load times, clean URLs.</p></section>
<section><h2>Process & Pricing</h2>
<h3>How does your process work?</h3><p>Three phases: Discovery (free 30-min call), Design & Build, Launch & Support. Fixed-price quotes with milestone-based payments.</p>
<h3>How do I get started?</h3><p>Contact us through the website form. Free 30-min discovery call within 24 hours.</p></section>
<p>Still wondering? Skip the form. Email us what you're building and we'll tell you straight whether we're the right team for it.</p>`,
  },
  "/pricing": {
    title: "Website Pricing From $300 | Web Development Costs | AHOS Beirut",
    description: "Transparent web development pricing from AHOS. Landing pages from $300, standard websites from $500, e-commerce from $800. Custom designs, no templates, full ownership. Launch in days.",
    bodyHtml: `<h1>Websites from $300</h1>
<p>Fixed prices, custom work, full ownership. What you see is what you pay.</p>
<section><h2>Landing Page — $300</h2><p>Single-page website for startups, products, or personal brands. Delivered in 2 days. Responsive, custom design, contact form, SEO meta tags, fast hosting.</p>
<h2>Standard Website — $500</h2><p>Multi-page site for small businesses. Up to 5 pages, responsive, custom branding, CMS, SEO, Google Analytics. Delivered in 3 days.</p>
<h2>E-Commerce Store — $800</h2><p>Full online store with up to 50 products, cart, checkout, payment gateway, order management. Delivered in 5 days.</p>
<h2>Custom Web App — From $1,500</h2><p>Bespoke web applications: dashboards, portals, SaaS platforms. Full-stack, auth, database, API, source code ownership. Delivered in 1-3 weeks.</p></section>
<section><h2>Pricing FAQ</h2>
<h3>What's included in the $500 standard website?</h3><p>A fully custom 5-page website with responsive design, SEO meta tags, contact form, CMS, social links, and Google Analytics. You own the code.</p>
<h3>How fast can you deliver?</h3><p>Landing pages in 2 days, standard sites in 3 days, e-commerce in 5 days.</p>
<h3>Do I need hosting?</h3><p>We can host or deploy to your existing hosting. Setup included. Ongoing hosting at cost ($5-15/mo).</p>
<h3>What if I need changes after launch?</h3><p>30 days of post-launch support included. Maintenance retainers available after.</p>
<h3>Do you offer payment plans?</h3><p>Milestone payments: 50% upfront, 50% on launch. E-commerce and web apps may split into 3 payments.</p></section>`,
  },
  "/web-development": {
    title: "Web Development Company in Lebanon | Custom Websites | AHOS",
    description: "AHOS is a web development company in Lebanon building custom websites, e-commerce stores, and web apps that load fast and convert — serving clients in the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Websites that earn their keep.</h1>
<p>Pixel-tight, fast, and built to convert — from a single landing page to a full-scale web application. Every site we ship is responsive, accessible, and tuned to perform.</p>
<section><h2>Custom Websites & Landing Pages</h2><p>High-impact landing pages, corporate sites, portfolio sites, startup MVPs — with CMS integration if you need it. Responsive on every screen, accessible by default.</p></section>
<section><h2>E-Commerce Development</h2><p>Shopify, WooCommerce, or headless commerce stores built for speed and conversion. Product filtering, payment gateways, order management, and analytics.</p></section>
<section><h2>Web Application Development</h2><p>Full-stack web applications — dashboards, client portals, booking systems, SaaS backends. Built with React, Next.js, Node.js with CI/CD and monitoring.</p></section>
<section><h2>SEO & Performance Optimization</h2><p>Technical SEO audits, Core Web Vitals optimization, structured data, and performance tuning to push your site to the top of search results.</p></section>
<section><h2>Maintenance & Hosting</h2><p>Security patches, backups, updates, and performance monitoring — all handled. Optional retainer or per-task basis.</p></section>`,
  },
  "/mobile-app-development": {
    title: "Mobile App Development in Lebanon | iOS & Android | AHOS",
    description: "AHOS builds native iOS, Android, and cross-platform mobile apps in Lebanon — from concept to App Store. Fixed-price, full code ownership, serving the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Apps people keep using.</h1>
<p>From concept to app store — iOS, Android, or cross-platform. We design, develop, and ship mobile applications that users genuinely enjoy opening every day.</p>
<section><h2>iOS App Development</h2><p>Native Swift and SwiftUI applications with in-app purchases, push notifications, Apple Pay — full App Store compliance and metadata.</p></section>
<section><h2>Android App Development</h2><p>Kotlin and Jetpack Compose apps with Material Design, deep linking, background services, Google Pay, and Play Store integration.</p></section>
<section><h2>Cross-Platform Apps</h2><p>Flutter or React Native for iOS and Android with a single codebase. Near-native performance, shared business logic, platform-specific UI where it counts.</p></section>
<section><h2>App UI/UX & Prototyping</h2><p>Wireframes, interactive prototypes, user flows, and pixel-perfect mobile UI. We test navigation and usability before writing platform code.</p></section>
<section><h2>Backend & API for Mobile</h2><p>RESTful and GraphQL APIs, real-time WebSockets, auth systems, push notification infrastructure, and cloud storage built to scale with your app.</p></section>`,
  },
  "/custom-software": {
    title: "Custom Software Development Company in Lebanon | AHOS",
    description: "AHOS is a custom software development company in Lebanon building SaaS platforms, dashboards, APIs, and automation — fixed-price, full ownership, serving the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Software that fits your workflow.</h1>
<p>Off-the-shelf tools make you bend to their logic. We build custom platforms, dashboards, and systems shaped to how your business actually runs.</p>
<section><h2>SaaS Platform Development</h2><p>Multi-tenant SaaS platforms with subscription billing, team management, role-based access, and usage analytics. Deployed with CI/CD and 99.9% uptime SLAs.</p></section>
<section><h2>Custom Dashboards & Internal Tools</h2><p>Admin panels, analytics dashboards, CRM integrations, and internal systems built around how your team works. Connected to your existing databases and APIs.</p></section>
<section><h2>API & Backend Development</h2><p>REST and GraphQL APIs, microservices, event-driven systems, and real-time data pipelines. Clean to consume, boringly reliable in production.</p></section>
<section><h2>Legacy System Modernization</h2><p>Replace aging systems without downtime. Phased migration — extract services, rebuild modules, cut over when each piece is proven stable.</p></section>
<section><h2>Integration & Automation</h2><p>Connect CRM, ERP, marketing tools, and payment gateways into single workflows. Automated data syncs, webhooks, custom automation infrastructure.</p></section>`,
  },
  "/ai-development": {
    title: "AI Development Company in Lebanon | AI & Automation | AHOS",
    description: "AHOS builds custom AI tools, chatbots, and workflow automation in Lebanon. From strategy to deployment — AI that does real work, for clients in the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>AI that actually does the work.</h1>
<p>Not another chatbot wrapper. Custom AI tools, automations, and intelligent systems built to save your team hours every week.</p>
<section><h2>Custom AI Tools & Agents</h2><p>Document processing, data extraction, content generation, classification, decision support. We pick the right model — OpenAI, open-source, or fine-tuned — and deploy it where it saves time.</p></section>
<section><h2>Workflow Automation with AI</h2><p>AI-powered pipelines that replace repetitive tasks. Email triage, lead scoring, invoice processing, report generation, and customer support routing.</p></section>
<section><h2>AI Chatbots & Virtual Assistants</h2><p>Custom chatbots trained on your business knowledge. FAQ bots, lead qualification, document Q&A, multi-step conversations, and human escalation when needed.</p></section>
<section><h2>LLM Integration & Fine-Tuning</h2><p>Integrate GPT, Claude, Llama, or open-source models into your product. Fine-tuning, RAG pipelines, and prompt engineering for reliable outputs at scale.</p></section>
<section><h2>AI Strategy & Consulting</h2><p>Feasibility studies, proof-of-concept builds, model selection, and clear roadmap from experiment to production. We help you identify where AI actually adds value.</p></section>`,
  },
  "/ecommerce-development": {
    title: "E-Commerce Development in Lebanon | Shopify & Custom | AHOS",
    description: "AHOS builds e-commerce stores in Lebanon on Shopify, WooCommerce, and custom platforms — payment optimisation, multi-currency, and full migration. Serving the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Stores built to sell.</h1>
<p>Shopify, WooCommerce, or fully custom — e-commerce platforms optimized for checkout speed, conversion rate, and inventory sanity.</p>
<section><h2>Shopify Store Development</h2><p>Custom storefronts with Liquid, Shopify Plus architecture, and headless Commerce Components. Custom themes, multi-currency, subscriptions, and third-party integrations.</p></section>
<section><h2>WooCommerce & WordPress Stores</h2><p>Self-hosted e-commerce with full code ownership. Custom product types, dynamic pricing, membership systems, and complete checkout control.</p></section>
<section><h2>Custom E-Commerce Platforms</h2><p>Multi-vendor marketplaces, digital delivery, auction systems, rental platforms — for businesses with unique requirements Shopify and WooCommerce can't handle.</p></section>
<section><h2>Payment & Checkout Optimization</h2><p>One-click checkout, local payment gateways, multi-currency support, abandoned cart recovery. We audit your funnel and fix every leak.</p></section>
<section><h2>Migration & Maintenance</h2><p>Migrate from Magento, BigCommerce, or custom platforms without downtime. Product data migration, SEO redirect mapping, and ongoing maintenance.</p></section>`,
  },
  "/ui-ux-design": {
    title: "UI/UX & Brand Design in Lebanon | Web & Mobile | AHOS",
    description: "AHOS designs interfaces, brand identities, and design systems for web and mobile in Lebanon — from user research to pixel-perfect UI. Serving the US and worldwide.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Designed to be impossible to ignore.</h1>
<p>Interfaces, brand identities, and design systems that communicate clearly, convert consistently, and scale effortlessly — from first sketch to shipped product.</p>
<section><h2>UI/UX Design for Web & Mobile</h2><p>User research, wireframes, high-fidelity mockups, and interactive prototypes. Designed in Figma with production-ready specs and handoff.</p></section>
<section><h2>Brand Identity & Design Systems</h2><p>Logo design, color systems, typography, iconography, and comprehensive design systems. Style guides and component libraries that scale across every touchpoint.</p></section>
<section><h2>Product Design & Strategy</h2><p>End-to-end product design from concept validation and user testing to pixel-perfect UI. Research-backed, outcome-focused, and iterative.</p></section>
<section><h2>Motion Design & Animation</h2><p>Micro-interactions, page transitions, scroll-triggered effects, and explainer videos. Motion that guides attention and provides feedback without overwhelming.</p></section>
<section><h2>Web & Mobile Redesign</h2><p>UX audit, content restructuring, modern visual design, and responsive front end for sites and apps that have outgrown their original design.</p></section>`,
  },
  "/work/speealigner": {
    title: "SpeeAligner — Case Study | AHOS",
    description: "How AHOS built SpeeAligner: a web · healthcare project, in the client's own words.",
    bodyHtml: `<h1>SpeeAligner</h1>
<p>Web · Healthcare — 2026</p>
<section><h2>What we built</h2><p>Web Development</p></section>
<blockquote><p>"I'm grateful for the team at AHOS — they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!"</p><footer>Yorgo, SpeeAligner.com, Lebanon</footer></blockquote>`,
  },
  "/work/ido-taxi": {
    title: "Ido Taxi — Case Study | AHOS",
    description: "How AHOS built Ido Taxi: a web · mobile app · transport project, in the client's own words.",
    bodyHtml: `<h1>Ido Taxi</h1>
<p>Web · Mobile App · Transport — 2025</p>
<section><h2>What we built</h2><p>Web Development, Mobile Apps</p></section>
<blockquote><p>"AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments — they handled every layer with care. The app is live, our drivers love it, and our passengers keep growing. Exactly what we needed."</p><footer>Khalil, Ido Taxi, Lebanon</footer></blockquote>`,
  },
};

// ── Per-service FAQ + cross-links ────────────────────────────────────────────
// Mirrors the ServiceFAQ / RelatedServices React components so non-JS crawlers
// see the same visible FAQ copy and internal links, plus FAQPage JSON-LD.
interface QA { q: string; a: string; }

const SERVICE_CATALOG = [
  { href: "/web-development", label: "Web Development", blurb: "Websites, e-commerce &amp; web apps" },
  { href: "/mobile-app-development", label: "Mobile App Development", blurb: "iOS, Android &amp; cross-platform" },
  { href: "/custom-software", label: "Custom Software", blurb: "SaaS, dashboards &amp; APIs" },
  { href: "/ai-development", label: "AI Development", blurb: "AI tools, chatbots &amp; automation" },
  { href: "/ecommerce-development", label: "E-Commerce Development", blurb: "Shopify, WooCommerce &amp; custom stores" },
  { href: "/ui-ux-design", label: "UI/UX &amp; Brand Design", blurb: "Interfaces &amp; design systems" },
  { href: "/web3", label: "Web3 &amp; Blockchain", blurb: "Smart contracts, dapps &amp; DeFi" },
];

const SERVICE_FAQS: Record<string, QA[]> = {
  "/web-development": [
    { q: "How much does a website cost?", a: "Landing pages start at $300, multi-page business sites at $500, and e-commerce stores from $800. You get a fixed-price quote after a free discovery call — no hourly surprises." },
    { q: "How long does it take to build a website?", a: "Landing pages take 1–2 weeks, business sites 2–4 weeks, and e-commerce platforms 3–6 weeks, depending on scope and how ready your content is." },
    { q: "Will I own the code and content?", a: "Yes — you receive full ownership of all source code, assets, and IP on final delivery, with no lock-in and 30 days of post-launch support included." },
  ],
  "/mobile-app-development": [
    { q: "How much does a mobile app cost?", a: "Mobile apps start at $1,000 and scale with features, platforms, and backend needs. You get a fixed-price quote after a free discovery call." },
    { q: "How long does it take to build a mobile app?", a: "Most apps take 4–10 weeks from concept to store submission, depending on features, platforms, and how much backend it needs." },
    { q: "Do you build for both iOS and Android?", a: "Yes — native Swift/Kotlin or cross-platform Flutter/React Native, whichever fits your product, budget, and timeline best. We handle App Store and Play Store submission." },
  ],
  "/custom-software": [
    { q: "How much does custom software cost?", a: "Custom software and SaaS platforms start at $1,500 and scale with scope. You get a fixed-price quote after a free discovery call — no open-ended hourly billing." },
    { q: "How long does a custom software project take?", a: "SaaS platforms typically take 6–16 weeks; smaller internal tools and dashboards are faster. We work in milestones so you see working software throughout." },
    { q: "Will I own the source code?", a: "Yes — full ownership of all source code, architecture, and IP on delivery, plus 30 days of post-launch support. No vendor lock-in." },
  ],
  "/ai-development": [
    { q: "How much does an AI tool or automation cost?", a: "Custom AI tools and automations start at $500 and scale with complexity. You get a fixed-price quote after a free discovery call." },
    { q: "What can AI actually automate for my business?", a: "Document processing, data extraction, customer-support routing, lead scoring, content generation, and internal Q&A — anything repetitive and rules-heavy is a candidate." },
    { q: "Which AI models do you use?", a: "We pick the right model for the job — OpenAI, Claude, Llama, or fine-tuned open-source — and build RAG or agent pipelines around reliable, testable outputs." },
  ],
  "/ecommerce-development": [
    { q: "How much does an e-commerce store cost?", a: "E-commerce stores start at $500 for a standard build and $800+ for full custom stores with up to 50 products. You get a fixed-price quote after a free call." },
    { q: "How long does it take to launch an online store?", a: "Most stores go live in 3–6 weeks, depending on product count, integrations, and whether you're migrating from an existing platform." },
    { q: "Can you migrate my existing store?", a: "Yes — we migrate from Shopify, WooCommerce, Magento, or custom platforms with full product-data transfer and SEO redirect mapping to protect your rankings." },
  ],
  "/ui-ux-design": [
    { q: "How much does UI/UX or brand design cost?", a: "Design engagements start at $200 and scale with scope — from a landing-page UI to a full brand identity and design system. Fixed-price quote after a free call." },
    { q: "What do I get from a design project?", a: "Research, wireframes, high-fidelity Figma mockups, interactive prototypes, and production-ready specs — plus brand assets and a design system where relevant." },
    { q: "Can you redesign my existing website or app?", a: "Yes — we run a UX audit, restructure content, and deliver a modern, responsive redesign you can hand straight to developers or have us build end to end." },
  ],
  "/web3": [
    { q: "How much does a Web3 project cost?", a: "Web3 and blockchain projects start at $2,500 and scale with scope — from a single smart contract to a full dapp with frontend and art. Fixed-price after a free call." },
    { q: "Do you audit smart contracts?", a: "Yes — contracts are gas-optimised and audited before any mainnet deployment, covering ERC-20, ERC-721/1155, DAO governance, and DeFi protocols." },
    { q: "Can you handle the full launch, not just contracts?", a: "Yes — contracts, dapp frontend, wallet integration, NFT/token mechanics, art direction, and go-to-market strategy, all under one roof." },
  ],
};

function buildFaqLd(items: QA[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  });
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function faqHtml(items: QA[]): string {
  return `<section><h2>Common questions</h2>${items.map((it) => `<h3>${esc(it.q)}</h3><p>${esc(it.a)}</p>`).join("")}</section>`;
}

function relatedHtml(current: string): string {
  const items = SERVICE_CATALOG.filter((s) => s.href !== current);
  return `<section><h2>Other things we build</h2><ul>${items.map((s) => `<li><a href="${s.href}">${s.label}</a> — ${s.blurb}</li>`).join("")}</ul></section>`;
}

for (const [path, items] of Object.entries(SERVICE_FAQS)) {
  const route = ROUTES[path];
  if (!route) continue;
  route.bodyHtml += faqHtml(items) + relatedHtml(path);
  route.faqJsonLd = buildFaqLd(items);
}

function buildMetaTags(path: string, meta: RouteMeta): string {
  const url = `${SITE_URL}${path === "/" ? "/" : path + "/"}`;
  const og = meta.ogImage || OG_IMAGE;
  const robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  let tags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="${robots}" />

    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${og}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AHOS — Digital Studio, Beirut" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${og}" />
    <meta name="twitter:site" content="@ahos_xyz" />
    <meta property="og:image:alt" content="AHOS — ${meta.title}" />
  `.trim();

  // Organization + WebSite schema on every page
  tags += `\n<script type="application/ld+json">${ORG_JSON_LD}</script>`;

  if (meta.jsonLd) {
    tags += `\n<script type="application/ld+json">${meta.jsonLd}</script>`;
  }

  if (meta.faqJsonLd) {
    tags += `\n<script type="application/ld+json">${meta.faqJsonLd}</script>`;
  }

  return tags;
}

function stripDefaultMeta(html: string, headEnd: number): string {
  const head = html.slice(0, headEnd);
  const rest = html.slice(headEnd);
  const patterns = [
    /<title>.*?<\/title>/gs,
    /<meta\s+name="description"[^>]*\/?>/gi,
    /<meta\s+property="og:[^"]*"[^>]*\/?>/gi,
    /<meta\s+name="twitter:[^"]*"[^>]*\/?>/gi,
    /<meta\s+name="robots"[^>]*\/?>/gi,
    /<link\s+rel="canonical"[^>]*\/?>/gi,
  ];
  let clean = head;
  for (const re of patterns) clean = clean.replace(re, "");
  return clean + rest;
}

function buildPageHtml(path: string, bareHtml: string, meta: RouteMeta): string {
  const metaTags = buildMetaTags(path, meta);
  const withMeta = bareHtml.replace("</head>", metaTags + "\n</head>");
  const bodyContent = `<div id="root"></div><div id="prerender" style="display:none">${meta.bodyHtml}</div><noscript><style>#prerender{display:block}</style></noscript>`;
  return withMeta.replace('<div id="root"></div>', bodyContent);
}

export function prerender(): Plugin {
  return {
    name: "ahos-prerender",
    apply: "build",
    closeBundle() {
      const outDir = join(process.cwd(), "dist");
      const indexHtml = readFileSync(join(outDir, "index.html"), "utf-8");
      const headEnd = indexHtml.indexOf("</head>");
      const bareHtml = stripDefaultMeta(indexHtml, headEnd);

      for (const [route, meta] of Object.entries(ROUTES)) {
        const html = buildPageHtml(route, bareHtml, meta);

        if (route === "/") {
          writeFileSync(join(outDir, "index.html"), html, "utf-8");
        } else {
          const dir = join(outDir, route.slice(1));
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, "index.html"), html, "utf-8");
        }
      }

      console.log(`[prerender] Generated ${Object.keys(ROUTES).length} static pages with body content + JSON-LD`);
    },
  };
}
