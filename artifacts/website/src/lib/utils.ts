// utils.ts: from Corsair UI by Kevin Girelli (MIT), published on 21st.dev as @kevingirelli.
// Source: https://github.com/KevinGirelli/corsair-ui/blob/main/registry/default/lib/utils.ts
// Unchanged, except the import paths. See THIRD_PARTY_LICENSES.md.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Joins class names and lets the last conflicting Tailwind utility win, so a
 * `className` passed by the consumer always overrides the component default.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
