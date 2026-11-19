import { BrowserFrame } from "@/components/corsair/browser-frame";
import { PhoneFrame } from "@/components/corsair/phone-frame";
import { asset, type Project } from "../../site.config";

/**
 * A project's desktop capture, in the real BrowserFrame from Corsair UI (https://21st.dev/@kevingirelli):
 * window dots, an address bar and a viewport that holds the screenshot. This file only chooses the
 * image and the address. The Tailwind classes here are picked up by styles/index.css (@source).
 */
export function Shot({ p, eager = false, sizes = "(max-width: 900px) 92vw, 64vw", className = "" }: { p: Project; eager?: boolean; sizes?: string; className?: string }) {
  if (!p.shot) return <AriaVisual />;
  return (
    <BrowserFrame url={p.liveLabel} aspect="16 / 10" className={`w-full shadow-2xl ${className}`}>
      <img
        src={asset(`/work/d-${p.shot}-880.webp`)}
        srcSet={`${asset(`/work/d-${p.shot}-880.webp`)} 880w, ${asset(`/work/d-${p.shot}.webp`)} 1440w`}
        sizes={sizes}
        width={1440}
        height={900}
        alt={`${p.name}, ${p.what.toLowerCase()} designed and built by AHOS`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
        className="h-full w-full object-cover object-top"
      />
    </BrowserFrame>
  );
}

/** A project's phone capture, in the real PhoneFrame. The width comes from the class. */
export function Phone({ p, eager = false, className = "w-36 drop-shadow-2xl" }: { p: Project; eager?: boolean; className?: string }) {
  if (!p.shot) return null;
  return (
    <PhoneFrame className={className}>
      <img src={asset(`/work/m-${p.shot}.webp`)} width={390} height={844} alt={`${p.name} on a phone`} loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover object-top" />
    </PhoneFrame>
  );
}

/** ARIA has no external site, so it gets a drawn conversation instead of a screenshot. */
export function AriaVisual() {
  return (
    <div className="aria-vis" role="img" aria-label="A conversation with ARIA, the AI project advisor AHOS built">
      <div className="aria-vis-top" aria-hidden="true"><b>ARIA</b><span>Project advisor</span></div>
      <div className="aria-vis-msgs" aria-hidden="true">
        <p className="a">Hi, I'm ARIA. What are you building?</p>
        <p className="u">An online store for my clothing brand in Beirut.</p>
        <p className="a">Nice. Will most people pay by card, or cash on delivery?</p>
        <p className="u">Mostly cash on delivery, and WhatsApp orders.</p>
        <p className="a">Then a custom store with COD and WhatsApp ordering fits. Usually 2 to 6 weeks. Want me to sketch a first screen?</p>
      </div>
    </div>
  );
}

