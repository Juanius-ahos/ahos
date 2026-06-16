import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import type { Plugin } from "vite";

interface RouteMeta {
  title: string;
  description: string;
  ogImage?: string;
}

const SITE_URL = "https://www.ahos.xyz";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

const ROUTES: Record<string, RouteMeta> = {
  "/": {
    title: "AHOS — Digital Product Studio",
    description:
      "AHOS is a digital product studio that builds premium websites, custom software, Web3 platforms, AI tools, and brand identities for businesses worldwide — from strategy to launch, under one roof.",
  },
  "/services": {
    title: "Services — Web, AI, Web3 & Design | AHOS",
    description:
      "From headless websites to smart contracts — AHOS delivers custom web development, AI automation, Web3 engineering, and brand design under one roof.",
  },
  "/web3": {
    title: "Web3 & Blockchain Development | AHOS",
    description:
      "Smart contracts, dapps, DeFi, NFT infrastructure, and token launches. AHOS builds audited Web3 solutions on EVM chains for startups and enterprises.",
  },
  "/careers": {
    title: "Careers — Join the Studio | AHOS",
    description:
      "AHOS hires rarely and well. Developers, designers, Web3 engineers, and motion artists who'd rather own a problem than close a ticket. Apply with your CV.",
  },
  "/contact": {
    title: "Start a Project — Build Your Plan | AHOS",
    description:
      "Tell AHOS what you're building with our quick project planner. A few steps and we'll come back with a clear plan within 24 hours.",
  },
  "/aria-ai": {
    title: "ARIA — Your AI Project Advisor | AHOS",
    description:
      "Chat with ARIA, the AHOS AI project advisor. Describe what you want to build and get instant, honest guidance — scope, timeline, and next steps.",
  },
  "/faq": {
    title: "FAQ — Answers About Working with AHOS",
    description:
      "Everything you want to know about working with AHOS: process, pricing, timeline, ownership, support, and more. Straight answers, no sales speak.",
  },
};

function buildMetaTags(path: string, meta: RouteMeta): string {
  const url = `${SITE_URL}${path}`;
  const og = meta.ogImage || OG_IMAGE;
  const robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return `
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
}

/** Remove default SEO tags so prerendered ones are the only ones in <head>. */
function stripDefaultMeta(html: string, headEnd: number): string {
  const head = html.slice(0, headEnd);
  const rest = html.slice(headEnd);

  const removePatterns = [
    /<title>.*?<\/title>/gs,
    /<meta\s+name="description"[^>]*\/?>/gi,
    /<meta\s+property="og:[^"]*"[^>]*\/?>/gi,
    /<meta\s+name="twitter:[^"]*"[^>]*\/?>/gi,
    /<meta\s+name="robots"[^>]*\/?>/gi,
    /<link\s+rel="canonical"[^>]*\/?>/gi,
  ];

  let clean = head;
  for (const re of removePatterns) {
    clean = clean.replace(re, "");
  }

  return clean + rest;
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
        const metaTags = buildMetaTags(route, meta);
        if (route === "/") {
          const html = bareHtml.replace("</head>", metaTags + "\n</head>");
          writeFileSync(join(outDir, "index.html"), html, "utf-8");
          continue;
        }

        const dir = join(outDir, route.slice(1));
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        const html = bareHtml.replace("</head>", metaTags + "\n</head>");
        writeFileSync(join(dir, "index.html"), html, "utf-8");
      }

      console.log(`[prerender] Generated ${Object.keys(ROUTES).length} static pages`);
    },
  };
}
