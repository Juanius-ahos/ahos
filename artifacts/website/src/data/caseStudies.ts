export interface CaseStudy {
  slug: string;
  name: string;
  category: string;
  year: string;
  url: string;
  img: string;
  services: string[];
  testimonial: { text: string; name: string; role: string; link?: string };
}

// Real projects, real testimonials already published on the site (Home + Trustpilot).
// Only projects with a genuine client quote get a case-study page — the rest stay
// as direct links from the work rail until there's real narrative content for them.
export const caseStudies: CaseStudy[] = [
  {
    slug: "speealigner",
    name: "SpeeAligner",
    category: "Web · Healthcare",
    year: "2026",
    url: "https://www.speealigner.com",
    img: "work/speealigner.jpg",
    services: ["Web Development"],
    testimonial: {
      text: "I'm grateful for the team at AHOS — they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!",
      name: "Yorgo",
      role: "SpeeAligner.com, Lebanon",
      link: "https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18",
    },
  },
  {
    slug: "ido-taxi",
    name: "Ido Taxi",
    category: "Web · Mobile App · Transport",
    year: "2025",
    url: "https://www.idotaxi.net",
    img: "work/idotaxi.jpg",
    services: ["Web Development", "Mobile Apps"],
    testimonial: {
      text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments — they handled every layer with care. The app is live, our drivers love it, and our passengers keep growing. Exactly what we needed.",
      name: "Khalil",
      role: "Ido Taxi, Lebanon",
    },
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
