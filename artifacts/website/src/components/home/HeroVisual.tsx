import { TiltScroll } from "@/components/corsair/tilt-scroll";
import { Phone, Shot } from "./Frames";
import { projectById } from "../../site.config";

/**
 * The homepage hero picture: one of our live sites in a real browser window with its phone capture
 * overlapping, leaning back and straightening as the page scrolls (the real TiltScroll from Corsair UI,
 * a CSS scroll-driven animation with no script). It stays flat below the md breakpoint.
 */
export function HeroVisual() {
  const p = projectById("issam");
  return (
    <TiltScroll timeline="root" flatBelow="md" angle={16} scale={0.94} className="relative mx-auto w-full max-w-[660px]">
      <Shot p={p} eager sizes="(max-width: 900px) 92vw, 660px" />
      <div className="absolute -right-3 -bottom-7 sm:-right-8">
        <Phone p={p} eager className="w-24 drop-shadow-2xl sm:w-32" />
      </div>
    </TiltScroll>
  );
}
