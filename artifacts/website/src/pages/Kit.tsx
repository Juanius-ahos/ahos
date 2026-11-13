import { Button, CaseCard, DeviceScene, Field, Kicker, Need, ProofBar, SectionHeader, ServiceCard, Stat, Testimonial, WhatsAppCta } from "../components/kit";
import { FaqList } from "../components/ui";
import { caseStudies, homeFaq, projects, services } from "../site.config";

/** Dev-only preview of every kit component (`pnpm dev`, then /kit). Not part of the build. */

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const SWATCHES: { name: string; hex: string; role: string; on?: string }[] = [
  { name: "Black", hex: "#0a0a0b", role: "background" },
  { name: "Charcoal", hex: "#17181b", role: "surfaces" },
  { name: "Orange", hex: "#ff6a1a", role: "accent, CTAs", on: "#0a0a0b" },
  { name: "Cream", hex: "#efe9df", role: "text on dark", on: "#0a0a0b" },
  { name: "Grey", hex: "#a8a7a2", role: "secondary text", on: "#0a0a0b" },
];

export default function Kit() {
  const yorgo = caseStudies.find((c) => c.quote)?.quote;
  return (
    <>
      <header className="ph"><div className="wrap ph-in solo"><div className="ph-main">
        <Kicker>Kit, dev only</Kicker>
        <h1 className="d d-6" style={{ marginTop: 20 }}>AHOS kit.</h1>
        <p className="lead">Every component the site is built from, on the real tokens.</p>
      </div></div></header>

      <section className="kit-sec"><div className="wrap">
        <h2>Colour, contrast on black</h2>
        <div className="kit-grid">
          {SWATCHES.map((s) => (
            <div key={s.hex} className="swatch">
              <i style={{ background: s.hex }} />
              <b>{s.name} {s.hex}</b>
              <span>{s.role}. {s.on ? `Text ${s.on} on it: ${ratio(s.hex, s.on).toFixed(1)}:1.` : ""} On black: {ratio(s.hex, "#0a0a0b").toFixed(1)}:1, on charcoal: {ratio(s.hex, "#17181b").toFixed(1)}:1.</span>
            </div>
          ))}
        </div>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Type</h2>
        <div className="kit-grid">
          <div><p className="type-m">Space Grotesk 600, -0.04em</p><p className="type-d">Design that sells. Code that holds.</p></div>
          <div><p className="type-m">Inter 400, body</p><p className="lead">Websites, online stores, bots and AI for businesses that want to look as good as they are. Fixed price, in writing, before we start.</p></div>
          <div><p className="type-m">JetBrains Mono 500, labels and numbers</p><p style={{ font: "600 2rem/1 var(--f-m)", letterSpacing: "-0.03em" }}>100+ / 30 days / 94</p></div>
        </div>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Buttons</h2>
        <div className="kit-row">
          <Button href="/contact">Primary</Button>
          <Button href="/work" variant="outline">Outline</Button>
          <Button href="/contact" size="sm">Small</Button>
          <Button href="/contact" size="lg">Large</Button>
          <WhatsAppCta where="kit" />
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Section header, kicker, stat</h2>
        <SectionHeader kicker="Services" title="What we build, and what it costs." lead="Every project gets a fixed quote after a free call. These are the starting points." />
        <div className="kit-row" style={{ gap: 56 }}>
          <Stat value="100+" label="projects delivered" />
          <Stat value="30 days" label="warranty on every build" />
          <Stat value="5 stars" label="in a client review on Trustpilot" href="https://www.trustpilot.com/review/ahos.xyz" />
        </div>
        <div style={{ marginTop: 40 }}><ProofBar /></div>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Service card, case card</h2>
        <div className="kit-grid">
          <ServiceCard s={services[0]} />
          <ServiceCard s={services[1]} />
        </div>
        <div className="kit-grid" style={{ marginTop: 32 }}>
          {projects.slice(0, 3).map((p) => <CaseCard key={p.id} p={p} />)}
        </div>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Testimonial, FAQ accordion</h2>
        <div className="kit-grid">
          {yorgo && <Testimonial {...yorgo} />}
          <FaqList items={homeFaq.slice(0, 4)} openFirst />
        </div>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Form fields, placeholder marker</h2>
        <div className="kit-grid">
          <Field id="k-name" label="Your name" placeholder="Jane Doe" hint="So we know who to reply to." />
          <Field id="k-site" label="Website or Instagram link" placeholder="https://" error="Please add a link we can open." />
          <Field id="k-goal" label="Main goal" options={["Get found on Google", "Sell online", "Automate replies", "Look more premium"]} />
          <Field id="k-note" label="Anything else" textarea />
        </div>
        <p style={{ marginTop: 28 }}><Need>the founder story, in your own words</Need></p>
      </div></section>

      <section className="kit-sec"><div className="wrap">
        <h2>Device scene (laptop and phone)</h2>
        <DeviceScene />
      </div></section>
    </>
  );
}
