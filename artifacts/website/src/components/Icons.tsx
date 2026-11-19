import type { ReactElement } from "react";

/** Small stroke icons for services and disciplines. They inherit the text colour and are decorative. */

const base = { viewBox: "0 0 32 32", width: 32, height: 32, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

const PATHS: Record<string, ReactElement> = {
  // a browser window
  "web-development": (<><rect x="3.5" y="6" width="25" height="20" rx="3" /><path d="M3.5 11.5h25" /><circle cx="7.5" cy="8.8" r="0.6" fill="currentColor" /><circle cx="10.5" cy="8.8" r="0.6" fill="currentColor" /><path d="M9 17h8M9 21h13" /></>),
  // a shopping bag
  "ecommerce-development": (<><path d="M6.5 10h19l-1.4 15a2 2 0 0 1-2 1.8H9.9a2 2 0 0 1-2-1.8L6.5 10Z" /><path d="M11.5 13V9.5a4.5 4.5 0 0 1 9 0V13" /></>),
  // a phone
  "mobile-app-development": (<><rect x="9" y="3.5" width="14" height="25" rx="3.2" /><path d="M14 7h4" /><circle cx="16" cy="24.2" r="0.9" fill="currentColor" /></>),
  // a terminal
  "custom-software": (<><rect x="3.5" y="5.5" width="25" height="21" rx="3" /><path d="m10 13 4 3.5-4 3.5M17 21h6" /></>),
  // a spark inside a chat bubble
  "ai-development": (<><path d="M5 8.5A3.5 3.5 0 0 1 8.5 5h15A3.5 3.5 0 0 1 27 8.5v10a3.5 3.5 0 0 1-3.5 3.5H15l-5.5 4.5V22H8.5A3.5 3.5 0 0 1 5 18.5v-10Z" /><path d="M16 9.5v7M12.5 13h7" /></>),
  // a pen nib on a frame
  "ui-ux-design": (<><path d="M5 27l3-9 12-12 6 6-12 12-9 3Z" /><path d="m16 10 6 6M8 18l6 6" /></>),
  // a cube
  web3: (<><path d="M16 3.5 27 9.8v12.4L16 28.5 5 22.2V9.8L16 3.5Z" /><path d="M5 9.8 16 16l11-6.2M16 16v12.5" /></>),
  // disciplines
  design: (<><path d="M5 27l3-9 12-12 6 6-12 12-9 3Z" /><path d="m16 10 6 6M8 18l6 6" /></>),
  engineering: (<><rect x="3.5" y="5.5" width="25" height="21" rx="3" /><path d="m10 13 4 3.5-4 3.5M17 21h6" /></>),
  ai: (<><path d="M16 4v5M16 23v5M4 16h5M23 16h5M7.8 7.8l3.5 3.5M20.7 20.7l3.5 3.5M24.2 7.8l-3.5 3.5M11.3 20.7l-3.5 3.5" /><circle cx="16" cy="16" r="3" /></>),
  motion: (<><circle cx="16" cy="16" r="11.5" /><path d="m13 11.5 8 4.5-8 4.5v-9Z" /></>),
};

export function Icon({ name, size = 32 }: { name: string; size?: number }) {
  const p = PATHS[name] ?? PATHS["web-development"];
  return <svg {...base} width={size} height={size}>{p}</svg>;
}
