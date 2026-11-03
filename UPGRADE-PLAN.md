# ahos.xyz upgrade plan

Audit of the live site on 3 November 2026 (build deployed 07:30 that day, commit `8fb5c8e`), at 1440px desktop and 390px mobile, plus mobile Lighthouse.

## Verdict

The site has good raw material: honest copy, real clients, a clear five-step process, solid SEO plumbing. It reads "not agency level" for four reasons:

1. **Two sites stitched together.** A dark starfield with a glowing 3D orb and globe, then a cream drafting-paper site. They share no visual language, so the brand feels undecided.
2. **The first viewport sells nothing.** A question ("What if you could watch your product being built?"), an orb, and "Scroll to build it". No offer, no proof, no CTA except the nav button. Then several screens of near-empty scroll film before the real pitch.
3. **The work is hidden.** Each project appears first as a gray wireframe with an X box. The real sites only show after a scroll-triggered sweep. Agencies win on work; ours is behind a placeholder.
4. **It is slow on phones.** Mobile Performance 42. The 3D film blocks the main thread and real content only renders after JavaScript runs.

## Scores (live, mobile Lighthouse 12, Edge)

| Category | Score |
|---|---|
| Performance | **42** |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

FCP 3.1 s, LCP 5.8 s, TBT 960 ms, Speed Index 18.2 s, CLS 0, TTI 7.5 s. 194 KiB unused JS (framer-motion vendor chunk 86% unused, gtag 41%, three.js `warm` chunk 30%).

## Findings

### Layout
- Homepage is 16,700px tall. Roughly 6,000px of it is the scroll film with little or no text on screen (one capture at 1440px is an empty black frame with a wireframe phone).
- Hero copy sits left, orb sits right, nothing anchors the bottom half of the viewport.
- Inner pages use three different systems: dark 3D hero + cream body (services, case studies), rounded cards with 80px gutters (pricing), and the 144px drafting grid (home). Pricing cards and FAQ accordions look like a different template.
- The web development hero and the SpeeAligner case study hero show the same laptop render, so service pages read as generic.
- Case study pages still use uppercase mono eyebrow labels ("WHAT WE BUILT"), which the site's own direction doc bans.
- Mobile: hero headline is fine, but the orb fills the lower two thirds; project sheets stack into a long facts table (Project, What we made, Where, Sheet, See it) that is heavier than the work itself.

### Typography
- Three families (Space Grotesk, Inter, JetBrains Mono) with about 25 distinct sizes on the homepage alone (14 to 115px headings, no clear scale).
- Mono is used for running UI ("2 to 4 weeks", stats strip, clock) at small sizes with wide tracking; it reads as dev-tool, not studio.
- Display headings are strong; body text at 14 to 17px on cream is low contrast in places (muted gray on #EFE9DF).

### Motion
- Motion budget is spent on the 3D film, which most visitors scroll past before it pays off.
- The signature "drawing becomes the live site" sweep is a good idea, but it starts from the wireframe, so a fast scroller or a reduced-motion visitor sees placeholders, not work.
- No motion on the parts that convert (work, services, CTA). Mixed stack: GSAP, ScrollTrigger, Lenis and framer-motion all ship.

### Copy
- No em dashes in visible copy. Good. But they survive in code that reaches users: `og:site_name` and the Organization description set at runtime by `SEOHead` from `src/seo/config.ts`, WhatsApp button `aria-label`, `404.html` title and body.
- Hero is a question, not a promise. The best line on the site ("We draw your product. Then we build it.") is buried about 7 screens down.
- Proof (50+ shipped, 5.0 Trustpilot, 24h reply) appears on service pages but not on the homepage first view.
- Pricing leads with "$500 standard website". That anchors AHOS as a budget shop. Your call; see decisions.

### Performance
- Content is client-rendered. The "prerender" is a duplicate copy of the page inside `<div style="display:none">`, so the browser paints nothing useful until JS runs.
- three.js film + shader warm-up on load: 2.3 s main-thread in the app chunk, 1.2 s unattributable (GPU/compositor).
- framer-motion used in 6 files only; GA4 loads eagerly in the head.
- 52 MB of film and loop video in `public/` (film 32 MB, loops 18 MB), mostly unreferenced since the switch to live 3D. Slows clones and deploys.
- GitHub Pages fixes cache TTL at 10 minutes; not changeable on this host (noted, not scored against us once JS is smaller).

### Accessibility
- Footer wordmark fails colour contrast.
- Two `<h1>` in the document (hidden prerender copy + real page).
- 3D canvas and starfield have no reduced-motion still frame on some pages.
- Otherwise solid: skip link, alt text on all images, keyboard-reachable FAQ.

### SEO and structured data
- Organization JSON-LD exists twice with different values: the build-time one (`priceRange: "$"`, areas incl. Gulf and Europe) and the runtime one from `SEOHead` (em dash description, areas "Lebanon, US, Worldwide"). Search engines see whichever ran last.
- Hidden `display:none` body copy is a cloaking risk; real SSR markup fixes it.
- Business facts live in four places: `src/seo/config.ts`, `plugins/prerender.ts` (hardcoded JSON-LD and per-route copy), `index.html`, `public/llms.txt`. Breaks the one-config rule.
- Missing: `BreadcrumbList` on inner pages, `Service` schema per service page tied to the org, `CreativeWork` for case studies.
- Good: canonical, OG/Twitter, sitemap (16 URLs), robots with AI crawlers, llms.txt, FAQPage schema.

## Upgrade plan (priority order)

### P0. One direction, work first (homepage)
- Keep the brand exactly as is: logo, favicon, safety orange `#FF6A1A`, ink, drafting paper, Space Grotesk and Inter.
- Retire the dark starfield, orb and globe film from the homepage. One world: drafting paper and ink, orange as the field colour, ink night bands for nav and footer.
- New first viewport: the promise as the H1 ("We draw your product. Then we build it."), one line of offer, primary CTA "Book a 30-minute call", secondary WhatsApp, proof row (50+ shipped, 5.0 Trustpilot, first reply in 24h). Below it, still inside the first scroll, a strip of the four real projects.
- Selected work: real site screenshots by default (from `public/3d`, `public/work`). The drawing becomes an overlay that draws itself over the screenshot and peels back on scroll, so the work is always visible and the idea survives. One outcome line per project, compact facts row.
- Homepage target: about 6,000 to 7,000px tall, every screen carrying content.

### P0. Real pre-rendering and performance (target mobile 90+ everywhere)
- Build-time `renderToString` into `#root` and hydrate, replacing the hidden duplicate. Fixes LCP, the double H1 and the cloaking risk.
- Remove framer-motion (port its 6 uses to GSAP or CSS). One motion stack: GSAP + ScrollTrigger + Lenis, loaded after first paint.
- three.js only on service pages that keep a 3D device scene, lazy-loaded when in view, with a still image first.
- GA4 loaded after first interaction or idle, events unchanged.
- Move unused film and loop video out of `public/` (kept in git history; nothing deleted from the brand set).

### P1. One config file
- New `site.config.ts` holding name, legal name, contact, address, hours, socials, areas, proof numbers, pricing facts, GA ID and per-route SEO. `SEOHead`, the prerender, `index.html` meta, `sitemap.xml`, `robots.txt` and `llms.txt` all generate from it. One Organization graph only.

### P1. Page system across the site
- One template set: page header (ink band, breadcrumb, H1, lead, CTA), section header, index list, facts row, quote, closing CTA. Apply to services, the six service pages, case studies, pricing, FAQ, careers, contact.
- Pricing rebuilt on the index-list pattern instead of rounded cards.
- Case studies: each uses its own project imagery (no shared laptop render), with challenge, what we built, result.

### P1. Motion with purpose
- Signature: drawings that self-draw on the work sheets and process schedule (SVG stroke draw, ScrollTrigger scrub).
- Headline line reveals on first view only, magnetic primary CTA, counters on the proof row, a horizontal work rail on desktop.
- Everything respects `prefers-reduced-motion` with a finished still state.

### P2. Typography and copy polish
- Fixed type scale (8 steps), mono limited to dimensions and times, body contrast at AA or better on paper.
- Remove every em dash that reaches users (meta, aria labels, 404). Add a `check:copy` build step that fails on em dashes, as in the Issam project.
- Tighten service page copy to one promise, three offers, proof, CTA.

### P2. Accessibility and SEO extras
- Fix footer contrast, single H1 per page, focus rings on the new components.
- Add `BreadcrumbList`, per-page `Service`, `CreativeWork` for case studies.
- Fresh OG image built from type and brand colours (no AI imagery). Gray labelled placeholders wherever a real photo is still needed (team, studio).

## Decisions I need from you

1. **Homepage 3D film**: retire it from the homepage (recommended; it is the main reason for Performance 42 and the split identity), or keep a shortened version below the fold.
2. **Pricing**: keep "$500 standard website" as the lead price, or switch to "from" pricing per service with the fixed-quote promise.
3. **Preview link**: pushing to `main` deploys straight to ahos.xyz. For review I can (a) open a PR only and you check it locally, or (b) create a public `Juanius-ahos/ahos-preview` repo that serves the branch on GitHub Pages, as done for the Issam project.

## Done means

- You approved this plan.
- `pnpm build` passes on the branch.
- Mobile Lighthouse 90+ in Performance, Accessibility, Best Practices and SEO on the homepage, a service page and a case study.
- PR open against `main` (nothing merged or deployed to ahos.xyz until you merge).
