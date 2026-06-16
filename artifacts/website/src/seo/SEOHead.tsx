import { useEffect } from "react";
import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  SHORT_NAME,
  DEFAULT_DESC,
  EMAIL,
  LOCALE,
  SOCIALS,
  GEO,
  KNOWS_ABOUT,
  OG_IMAGE,
  LOGO_URL,
} from "./config";

const { latitude, longitude } = GEO;

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  /** Set false on thin/duplicate pages to keep them out of the index. */
  noindex?: boolean;
}

// Brand name appears as the title suffix. Pages whose title already contains
// the brand (e.g. the home page) skip the suffix to avoid duplication.
const titleFor = (title: string) =>
  title.includes(SHORT_NAME) ? title : `${title} | ${SITE_NAME}`;

function upsertMeta(key: string, content: string) {
  const isProp = key.startsWith("og:") || key.startsWith("article:");
  const selector = isProp ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(isProp ? "property" : "name", key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SEOHead({ title, description, path, ogImage, noindex }: SEOProps) {
  const fullTitle = titleFor(title);
  const url = `${SITE_URL}${path}`;
  const og = ogImage || OG_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    // Core
    upsertMeta("description", description);
    upsertLink("canonical", url);
    upsertMeta(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // Open Graph
    upsertMeta("og:title", fullTitle);
    upsertMeta("og:description", description);
    upsertMeta("og:url", url);
    upsertMeta("og:image", og);
    upsertMeta("og:image:alt", `${SHORT_NAME} — ${title}`);
    upsertMeta("og:image:width", "1200");
    upsertMeta("og:image:height", "630");
    upsertMeta("og:type", "website");
    upsertMeta("og:site_name", SITE_NAME);
    upsertMeta("og:locale", LOCALE);

    // Twitter / X
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", fullTitle);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", og);
    upsertMeta("twitter:image:alt", `${SHORT_NAME} — ${title}`);

    // Hreflang
    upsertLink("alternate", url);
    document.head.querySelector('link[rel="alternate"]')?.setAttribute("hreflang", "en");

    // Geographic targeting (local SEO)
    upsertMeta("geo.region", GEO.region);
    upsertMeta("geo.placename", GEO.placename);
    upsertMeta("geo.position", `${GEO.latitude};${GEO.longitude}`);
    upsertMeta("ICBM", `${GEO.latitude}, ${GEO.longitude}`);

    // Business contact data (Open Graph)
    upsertMeta("business:contact_data:street_address", "");
    upsertMeta("business:contact_data:locality", "Beirut");
    upsertMeta("business:contact_data:country_name", GEO.country);
    upsertMeta("business:contact_data:email", EMAIL);
    upsertMeta("business:contact_data:website", SITE_URL);
  }, [fullTitle, description, url, og, noindex]);

  return null;
}

export function OrganizationSchema() {
  const id = `${SITE_URL}/#organization`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": id,
        name: SHORT_NAME,
        legalName: LEGAL_NAME,
        alternateName: LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
        image: OG_IMAGE,
        description: DEFAULT_DESC,
        email: EMAIL,
        slogan: "We build digital products that perform.",
        knowsAbout: KNOWS_ABOUT,
        address: {
          "@type": "PostalAddress",
          addressCountry: GEO.countryCode,
          addressRegion: GEO.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude,
          longitude,
        },
        areaServed: [
          { "@type": "Country", name: GEO.country },
          { "@type": "AdministrativeArea", name: "Worldwide" },
        ],
        sameAs: SOCIALS,
        contactPoint: {
          "@type": "ContactPoint",
          email: EMAIL,
          contactType: "sales",
          availableLanguage: ["English", "Arabic"],
          areaServed: "Worldwide",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AHOS Services",
          itemListElement: KNOWS_ABOUT.slice(0, 6).map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESC,
        publisher: { "@id": id },
        inLanguage: "en",
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
