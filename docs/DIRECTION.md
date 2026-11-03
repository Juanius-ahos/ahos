# Direction (development only, never shipped)

Surface: ahos.xyz marketing site. Mode: persuade. Code-led, no generated imagery.

THESIS
AHOS shows its work the way a builder shows a building: as drawings that become the real thing.

WORLD
Drafting paper #EFE9DF as the ground. Ink #0A0A0B for type, linework, the nav, quotes and the footer. Safety orange #FF6A1A owns whole fields (services, closing CTA) and marks dimensions. 1px ink linework, title blocks with real project facts, a faint drawing grid behind headers. Brand faces: Space Grotesk for display, Inter for text, JetBrains Mono only for measurements and times. Sentence case. Icons are authored SVG drafting arrows.

FIRST VIEWPORT
The promise as the H1, one line of offer, two CTAs, the proof row, then the four real projects in browser frames.

SIGNATURE
On each project frame the original drawing sketches itself in orange over the live screenshot, then a build line sweeps it away. The work is always visible; the drawing is an enhancement.

RULES
All facts and copy-level config live in artifacts/website/src/site.config.ts. No em dashes (pnpm check:copy). No AI imagery: labelled gray placeholders where a real photo is missing. Motion loads after first paint and never hides content before it runs.
