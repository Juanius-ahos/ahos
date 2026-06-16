import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { Plugin } from "vite";

interface RouteMeta {
  title: string;
  description: string;
  ogImage?: string;
  bodyHtml: string;
  jsonLd?: string;
}

const SITE_URL = "https://www.ahos.xyz";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const ORG_JSON_LD = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "${SITE_URL}/#organization",
      "name": "Advanced Hybrid Online Systems",
      "alternateName": "AHOS",
      "url": "${SITE_URL}",
      "logo": "${SITE_URL}/logo.png",
      "email": "info@ahos.xyz",
      "description": "AHOS is a digital product studio building premium websites, custom software, Web3 platforms, AI tools, and brand identities.",
      "address": { "@type": "PostalAddress", "addressCountry": "LB" },
      "knowsAbout": ["Web Development","Custom Software","SaaS","Web3","Smart Contracts","Blockchain","Artificial Intelligence","Automation","Brand Identity","UI/UX Design","E-commerce","Mobile App Development"],
      "sameAs": ["https://www.instagram.com/ahos.xyz/","https://www.linkedin.com/company/ahos-xyz","https://www.youtube.com/@ahos_xyz"]
    },
    {
      "@type": "WebSite",
      "@id": "${SITE_URL}/#website",
      "url": "${SITE_URL}",
      "name": "AHOS — Digital Product Studio",
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
      "acceptedAnswer": { "@type": "Answer", "text": "Fixed-price quotes after a free discovery call. Budget ranges typically start from $1,000 depending on scope, complexity, and timeline." }
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
    title: "AHOS — Digital Product Studio",
    description:
      "AHOS is a digital product studio that builds premium websites, custom software, Web3 platforms, AI tools, and brand identities for businesses worldwide — from strategy to launch, under one roof.",
    jsonLd: ORG_JSON_LD,
    bodyHtml: `<h1>We build digital experiences.</h1>
<p>AHOS is a boutique digital product studio. We architect custom digital solutions from strategy to launch — for businesses that are built to stand out. Websites, custom software, Web3 platforms, AI tools, and brand identities — under one roof, no handoffs.</p>
<section><h2>Five capabilities, one studio.</h2>
<h3>Web Development</h3><p>Fast, pixel-tight sites built to earn their keep. Responsive on every screen, tuned for search, and ready to scale — from a single landing page to full e-commerce.</p>
<h3>Custom Software</h3><p>SaaS platforms, web apps, dashboards, automation — software shaped to how your business actually runs, from first sketch to deployed product you fully own.</p>
<h3>Web3 & Blockchain</h3><p>Audited smart contracts, dapps, token launches, and DeFi interfaces. Every layer of your Web3 project under one roof.</p>
<h3>AI & Automation</h3><p>Custom AI tools, chatbots, and workflow automations. From a simple chat interface to full agent pipelines — built to save you hours every week.</p>
<h3>Media & Branding</h3><p>Video, motion, identity systems, and social packs — so everything you put out looks like it came from one confident brand.</p></section>
<section><h2>Selected work</h2><p>SpeeAligner, YourProvider, Aleph, Ido Taxi, ARIA AI — websites, mobile apps, and AI tools we've shipped.</p></section>
<section><h2>Three steps to a live product.</h2>
<h3>Discovery</h3><p>A free consultation to learn your goals, define the product, and map a clear plan with a fixed-price quote.</p>
<h3>Design & Build</h3><p>We craft your solution with clean code and sharp design — milestone updates at every stage.</p>
<h3>Launch & Support</h3><p>We deploy, monitor, and support from day one, with 24/7 availability and a 30-day warranty.</p></section>
<section><h2>No surprises. In writing.</h2><p>100% source code yours · 30 day post-launch warranty · 24h average first reply · 0 hidden fees — fixed quotes.</p></section>`,
  },
  "/services": {
    title: "Services — Web, AI, Web3 & Design | AHOS",
    description:
      "From headless websites to smart contracts — AHOS delivers custom web development, AI automation, Web3 engineering, and brand design under one roof.",
    jsonLd: SERVICE_JSON_LD,
    bodyHtml: `<h1>Three things, done properly.</h1>
<p>Software, web, and brand — handled by one team that talks to itself. No agency relay race, no finger-pointing when something breaks.</p>
<section><h2>Custom Software</h2>
<p>Off-the-shelf tools make you bend to their logic. We do the opposite: software shaped to how your business actually runs, from first sketch to a deployed, scalable product you fully own.</p>
<p>SaaS Platforms · Web Apps · Dashboards · Automation · API Integration — full source-code ownership, architecture that scales with you, optional hosting and long-term support.</p></section>
<section><h2>Web Development</h2>
<p>Every site we ship is fast, pixel-tight, and built to earn its keep — responsive on every screen, tuned for search, and ready to scale. From a single landing page to full e-commerce.</p>
<p>Landing Pages · Corporate Sites · E-Commerce · Maintenance · Hosting — responsive on every device, speed and conversion optimised, scalable foundation from day one.</p></section>
<section><h2>Media & Branding</h2>
<p>Visuals that tell your story and hold a room. Video, motion, identity systems, and social packs — so everything you put out looks like it came from one confident brand.</p>
<p>Video Editing · 2D Animation · Brand Identity · Style Guides · Social Packs — polished, professional visuals, consistent identity everywhere, every source file handed over.</p></section>
<p>Book a free 30-minute call. We'll listen, point you at the right move, and hand you a clear plan — no pressure, no commitment.</p>`,
  },
  "/web3": {
    title: "Web3 & Blockchain Development | AHOS",
    description:
      "Smart contracts, dapps, DeFi, NFT infrastructure, and token launches. AHOS builds audited Web3 solutions on EVM chains for startups and enterprises.",
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
    title: "Careers — Join the Studio | AHOS",
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
    title: "Start a Project — Build Your Plan | AHOS",
    description:
      "Tell AHOS what you're building with our quick project planner. A few steps and we'll come back with a clear plan within 24 hours.",
    bodyHtml: `<h1>Let's plan your build.</h1>
<p>Four quick steps — no essay required. We'll read it, think about it, and come back with a straight answer and a clear plan, usually within a day.</p>
<section><h2>Step 1 — What are you building?</h2><p>Website, Web app/SaaS, Mobile app, Web3/DeFi, AI/Automation, Branding — and what industry you're in.</p></section>
<section><h2>Step 2 — What's the main goal?</h2><p>Generate leads, Sell online, Build authority, Automate a process, Launch an MVP, Raise/pitch — and where you are right now (idea, concept, designs ready, existing brand, rework).</p></section>
<section><h2>Step 3 — Budget & timeline</h2><p>Rough budget and ideal timeline — from under $3k to $20k+, from 2 weeks to flexible.</p></section>
<section><h2>Step 4 — Your details</h2><p>Name, email, phone, company, and a brief message. We'll come back with a clear plan within 24 hours.</p></section>
<p>Email: info@ahos.xyz · Based in Beirut — worldwide · Reply within 24 hours.</p>`,
  },
  "/aria-ai": {
    title: "ARIA — Your AI Project Advisor | AHOS",
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
    title: "FAQ — Answers About Working with AHOS",
    description:
      "Everything you want to know about working with AHOS: process, pricing, timeline, ownership, support, and more. Straight answers, no sales speak.",
    jsonLd: FAQ_JSON_LD,
    bodyHtml: `<h1>No fluff. Straight answers.</h1>
<p>Everything people actually ask before they hit "start a project." Can't find it? Email us — a human replies.</p>
<section><h2>General</h2>
<h3>What is AHOS?</h3><p>AHOS (Advanced Hybrid Online Systems) is a boutique digital product studio that builds websites, custom software, mobile apps, Web3/DeFi platforms, AI tools, and brand identities. We handle everything from strategy to launch under one roof.</p>
<h3>How much does a website or app cost?</h3><p>Fixed-price quotes after a free discovery call. Budget ranges typically start from $1,000 depending on scope, complexity, and timeline.</p>
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
};

function buildMetaTags(path: string, meta: RouteMeta): string {
  const url = `${SITE_URL}${path}`;
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
    <meta property="og:site_name" content="AHOS — Digital Product Studio" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${og}" />
  `.trim();

  if (meta.jsonLd) {
    tags += `\n<script type="application/ld+json">${meta.jsonLd}</script>`;
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

function buildPageHtml(bareHtml: string, meta: RouteMeta): string {
  const metaTags = buildMetaTags("/", meta);
  const withMeta = bareHtml.replace("</head>", metaTags + "\n</head>");
  const bodyContent = `<div id="root">${meta.bodyHtml}</div>`;
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
        const html = buildPageHtml(bareHtml, meta);

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
