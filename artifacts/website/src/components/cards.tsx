import { Reveal } from "@/components/corsair/reveal";
import { Spotlight } from "@/components/corsair/spotlight";
import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { Icon } from "./Icons";
import { money, type Service } from "../site.config";

/**
 * One service as a card: icon, number, name, what it is, what is included, the starting price and the
 * timeline. The whole card is one link (the overlay), with the cursor spotlight on fine pointers.
 */
export function ServiceCard({ s, no, wide = false, size = "full" }: { s: Service; no?: number; wide?: boolean; size?: "full" | "small" }) {
  return (
    <Reveal asChild><Spotlight asChild color="var(--primary)" size={340}><article className={`cx${wide ? " is-wide" : ""}`}>
      <div className="cx-top">
        <span className="cx-ico"><Icon name={s.slug} /></span>
        {no !== undefined && <span className="cx-no" aria-hidden="true">{String(no).padStart(2, "0")}</span>}
      </div>
      <h3>{s.label}</h3>
      <p className="cx-body">{s.blurb}</p>
      {size === "full" && <p className="tags">{s.offers.map((o) => <span key={o.name}>{o.name}</span>)}</p>}
      <div className="cx-foot">
        <div className="cx-from"><small>From</small><b>{money(s.from)}</b></div>
        <div className="cx-time">{s.timeline} <Arrow className="cx-arrow" /></div>
      </div>
      <Link href={s.href} className="cx-link" aria-label={`${s.label}, from ${money(s.from)}`} />
    </article></Spotlight></Reveal>
  );
}

/** A pricing card: the same data, led by the number. */
export function PriceCard({ s }: { s: Service }) {
  return (
    <Reveal asChild><Spotlight asChild color="var(--primary)" size={340}><article className="cx">
      <div className="cx-top">
        <span className="cx-ico"><Icon name={s.slug} /></span>
        <span className="cx-no">{s.timeline}</span>
      </div>
      <h3>{s.label}</h3>
      <div className="px-price"><small>Starts at</small>{money(s.from)}</div>
      <p className="cx-body">{s.blurb}</p>
      <p className="tags">{s.offers.map((o) => <span key={o.name}>{o.name}</span>)}</p>
      <div className="cx-foot">
        <span className="cx-time" style={{ textAlign: "left" }}>Fixed quote, in writing</span>
        <span className="cx-time"><Arrow className="cx-arrow" /></span>
      </div>
      <Link href={s.href} className="cx-link" aria-label={`${s.label}, from ${money(s.from)}`} />
    </article></Spotlight></Reveal>
  );
}
