import { Marquee as CorsairMarquee } from "@/components/corsair/marquee";

/**
 * The services as a band of big words that scrolls sideways. The scrolling is the real Marquee from
 * Corsair UI (https://21st.dev/@kevingirelli): it pauses on hover and off screen, can be dragged, and
 * becomes a scrollable box for reduced motion. This only sets the words in our display face, alternating
 * solid and outlined, with the brand slash between them.
 */
export function Marquee({ items, seconds = 46 }: { items: string[]; seconds?: number }) {
  return (
    <div className="mq">
      <CorsairMarquee duration={seconds} gap="3rem" pauseOnHover draggable fade fadeAmount={8} repeat={2} label="Our services">
        {items.map((t, i) => (
          <span key={t} className={`mq-w${i % 2 ? " is-out" : ""}`}>{t}<i aria-hidden="true" /></span>
        ))}
      </CorsairMarquee>
    </div>
  );
}
