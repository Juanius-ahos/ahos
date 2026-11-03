// Build step 3 of 3. Renders every route to static HTML with React on the server,
// writes per-page head tags and JSON-LD, then generates sitemap.xml, robots.txt,
// llms.txt and 404.html. Everything comes from src/site.config.ts.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SSR = join(ROOT, "dist-ssr");

// PREVIEW=1 builds a review copy: never indexed, and never claims the ahos.xyz domain.
const PREVIEW = process.env.PREVIEW === "1" || process.argv.includes("--preview");

const mod = await import(pathToFileURL(join(SSR, "entry-server.js")).href);
const { render, routes, site, services, caseStudies, projects, faqCategories, homeFaq, pricing, money } = mod;

// Inline the one stylesheet: it is small, and it saves a round trip before first paint.
const template = readFileSync(join(DIST, "index.html"), "utf-8").replace(
  /<link rel="stylesheet" crossorigin href="[^"]*\/(assets\/[^"]+\.css)">/,
  (_, file) => `<style>${readFileSync(join(DIST, file), "utf-8")}</style>`,
);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => `${site.url}${p === "/" ? "/" : p.endsWith("/") || p.includes(".") ? p : p + "/"}`;
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

const ORG_ID = `${site.url}/#organization`;
const organization = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}${site.logo}`,
  image: `${site.url}${site.ogImage}`,
  description: site.summary,
  email: site.contact.email,
  telephone: site.contact.phone,
  foundingDate: site.founded,
  address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
  geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes }],
  priceRange: "$$",
  areaServed: site.areasServed.map((n) => ({ "@type": n === "Europe" ? "AdministrativeArea" : "Country", name: n })),
  availableLanguage: site.languages,
  knowsAbout: services.map((s) => s.seo.schemaName),
  sameAs: site.socials.map((s) => s.href),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.seo.schemaName, url: abs(s.href) }, priceSpecification: { "@type": "PriceSpecification", minPrice: s.from, priceCurrency: "USD" } })),
  },
};
const website = { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.siteName, inLanguage: site.lang, publisher: { "@id": ORG_ID } };

const faqLd = (items) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

function crumbsLd(r) {
  const items = [{ name: "Home", url: abs("/") }];
  if (services.some((s) => s.href === r.path)) items.push({ name: "Services", url: abs("/services") });
  if (r.path.startsWith("/work/")) items.push({ name: "Work", url: `${site.url}/#work` });
  if (r.path !== "/") items.push({ name: r.crumb || r.title, url: abs(r.path) });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })) };
}

function pageLd(r) {
  const out = [{ "@context": "https://schema.org", "@graph": [organization, website] }];
  if (r.path !== "/") out.push(crumbsLd(r));
  const svc = services.find((s) => s.href === r.path);
  if (svc) {
    out.push({ "@context": "https://schema.org", "@type": "Service", name: svc.seo.schemaName, description: svc.seo.description, url: abs(svc.href), provider: { "@id": ORG_ID }, areaServed: organization.areaServed, offers: { "@type": "Offer", priceSpecification: { "@type": "PriceSpecification", minPrice: svc.from, priceCurrency: "USD" } } });
    out.push(faqLd(svc.faqs));
  }
  const cs = caseStudies.find((c) => `/work/${c.slug}` === r.path);
  if (cs) {
    const p = projects.find((x) => x.id === cs.project);
    out.push({ "@context": "https://schema.org", "@type": "CreativeWork", name: `${p.name}: ${p.what}`, headline: cs.title, description: cs.lead, url: abs(r.path), image: `${site.url}/work/${p.shot}.webp`, creator: { "@id": ORG_ID }, dateCreated: p.year, sameAs: p.live, review: { "@type": "Review", reviewBody: cs.quote.text, author: { "@type": "Person", name: cs.quote.name } } });
  }
  if (r.path === "/") out.push(faqLd(homeFaq));
  if (r.path === "/faq") out.push(faqLd(faqCategories.flatMap((c) => c.items)));
  if (r.path === "/pricing") out.push(faqLd(pricing.faqs));
  return out.map(ld).join("\n    ");
}

function head(r) {
  const url = abs(r.path);
  const og = `${site.url}${site.ogImage}`;
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${PREVIEW ? "noindex, nofollow" : r.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}" />`,
    `<meta name="theme-color" content="${site.themeColor}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.siteName)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(site.name)}: ${esc(site.tagline)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${site.twitter}" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${og}" />`,
    `<meta name="geo.region" content="${site.address.country}" />`,
    `<meta name="geo.placename" content="${site.address.city}" />`,
    pageLd(r),
  ].join("\n    ");
}

function page(path, meta) {
  const html = render(path);
  return template.replace("<!--head-->", head(meta)).replace("<!--app-->", html);
}

for (const r of routes) {
  const file = r.path === "/" ? join(DIST, "index.html") : join(DIST, r.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(r.path, r));
}

writeFileSync(join(DIST, "404.html"), page("/404", { path: "/404", title: "Page not found | AHOS", description: "This page is not on the drawings.", noindex: true }));

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.filter((r) => !r.noindex).map((r) => `  <url><loc>${abs(r.path)}</loc><lastmod>${today}</lastmod><priority>${r.priority.toFixed(1)}</priority></url>`).join("\n") +
  `\n</urlset>\n`);

writeFileSync(join(DIST, "robots.txt"),
  `# ${site.name} robots.txt\nUser-agent: *\nAllow: /\n\n# AI assistants and answer engines are welcome to read and cite this site.\n` +
  ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"].map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n") +
  `\n\nSitemap: ${site.url}/sitemap.xml\n`);

writeFileSync(join(DIST, "llms.txt"), [
  `# ${site.name}, ${site.legalName}`,
  "",
  `> ${site.summary}`,
  "",
  `Based in ${site.address.city}, ${site.address.countryName}, since ${site.founded}. Working with clients in ${site.areasLine}, in ${site.languages.join(", ")}.`,
  `Every project gets a fixed quote in writing after a free 30-minute call. Clients own all code, designs and content. ${site.warranty}.`,
  "",
  "## Services and starting prices",
  ...services.map((s) => `- [${s.label}](${abs(s.href)}): ${s.blurb} From ${money(s.from)}, ${s.timeline.toLowerCase()}.`),
  "",
  "## Selected work",
  ...projects.map((p) => `- ${p.name} (${p.what}, ${p.where}): ${p.outcome} ${p.live}`),
  "",
  "## Pages",
  ...routes.map((r) => `- [${r.crumb || "Home"}](${abs(r.path)}): ${r.description}`),
  "",
  "## Contact",
  `- Email: ${site.contact.email}`,
  `- WhatsApp: ${site.contact.phone} (${site.contact.whatsapp})`,
  `- First reply within ${site.contact.replyWithin}`,
  "",
].join("\n"));

if (PREVIEW) {
  writeFileSync(join(DIST, "robots.txt"), ["User-agent: *", "Disallow: /", ""].join("\n"));
  if (existsSync(join(DIST, "CNAME"))) rmSync(join(DIST, "CNAME"));
  writeFileSync(join(DIST, ".nojekyll"), "");
}

rmSync(SSR, { recursive: true, force: true });
console.log(`[prerender]${PREVIEW ? " PREVIEW" : ""} ${routes.length} pages, 404, sitemap.xml, robots.txt, llms.txt`);
