/**
 * Drawing data for the work frames. Each project's first screen, measured from
 * the live site and stored as fractions of a 1440 x 900 frame. The generator
 * gives every line a small deterministic wobble so it reads as drawn, not plotted.
 */
export type Mark =
  | { k: "bar"; x: number; y: number; w: number; h: number }
  | { k: "text"; x: number; y: number; w: number; h: number; lines?: number; heavy?: boolean }
  | { k: "img"; x: number; y: number; w: number; h: number }
  | { k: "btn"; x: number; y: number; w: number; h: number; fill?: boolean }
  | { k: "box"; x: number; y: number; w: number; h: number }
  | { k: "rule"; x: number; y: number; w: number }
  | { k: "ring"; x: number; y: number; r: number };
export type Note = { x: number; y: number; to: [number, number]; text: string };

export const W = 1440;
export const H = 900;

export const drawings: Record<string, { marks: Mark[]; notes: Note[] }> = {
  threads: {
    marks: [
      { k: "bar", x: 0, y: 0, w: 1, h: 0.04 },
      { k: "box", x: 0.02, y: 0.055, w: 0.095, h: 0.035 }, { k: "text", x: 0.13, y: 0.06, w: 0.37, h: 0.025, lines: 1 }, { k: "box", x: 0.89, y: 0.055, w: 0.08, h: 0.035 },
      { k: "text", x: 0.02, y: 0.2, w: 0.2, h: 0.02, lines: 1 },
      { k: "text", x: 0.02, y: 0.25, w: 0.25, h: 0.36, lines: 3, heavy: true },
      { k: "text", x: 0.02, y: 0.65, w: 0.36, h: 0.1, lines: 3 },
      { k: "btn", x: 0.02, y: 0.81, w: 0.11, h: 0.06, fill: true }, { k: "btn", x: 0.14, y: 0.81, w: 0.09, h: 0.06 },
      { k: "img", x: 0.52, y: 0.22, w: 0.45, h: 0.55 },
      { k: "text", x: 0.69, y: 0.82, w: 0.09, h: 0.09, lines: 2 }, { k: "box", x: 0.68, y: 0.92, w: 0.11, h: 0.05 },
    ],
    notes: [
      { x: 0.42, y: 0.16, to: [0.25, 0.3], text: "one line, the whole promise" },
      { x: 0.3, y: 0.95, to: [0.075, 0.84], text: "cash on delivery, in one tap" },
    ],
  },
  speealigner: {
    marks: [
      { k: "box", x: 0.128, y: 0.02, w: 0.028, h: 0.05 }, { k: "text", x: 0.347, y: 0.03, w: 0.39, h: 0.025, lines: 1 }, { k: "btn", x: 0.768, y: 0.02, w: 0.103, h: 0.047, fill: true },
      { k: "text", x: 0.125, y: 0.19, w: 0.62, h: 0.07, lines: 1, heavy: true }, { k: "rule", x: 0.125, y: 0.295, w: 0.747 },
      { k: "text", x: 0.125, y: 0.33, w: 0.5, h: 0.07, lines: 1, heavy: true }, { k: "rule", x: 0.125, y: 0.433, w: 0.747 },
      { k: "text", x: 0.125, y: 0.46, w: 0.675, h: 0.08, lines: 1, heavy: true },
      { k: "text", x: 0.125, y: 0.61, w: 0.37, h: 0.1, lines: 3 },
      { k: "btn", x: 0.125, y: 0.77, w: 0.113, h: 0.05, fill: true }, { k: "btn", x: 0.246, y: 0.77, w: 0.126, h: 0.05 },
      { k: "rule", x: 0.125, y: 0.9, w: 0.225 },
    ],
    notes: [
      { x: 0.93, y: 0.3, to: [0.75, 0.225], text: "three lines, one rhythm" },
      { x: 0.5, y: 0.84, to: [0.18, 0.795], text: "clinics submit a case here" },
    ],
  },
  julsauto: {
    marks: [
      { k: "bar", x: 0, y: 0, w: 1, h: 0.08 },
      { k: "img", x: 0, y: 0.08, w: 1, h: 0.92 },
      { k: "text", x: 0.455, y: 0.278, w: 0.092, h: 0.033, lines: 1 },
      { k: "text", x: 0.37, y: 0.344, w: 0.262, h: 0.178, lines: 2, heavy: true },
      { k: "btn", x: 0.338, y: 0.573, w: 0.169, h: 0.06, fill: true }, { k: "btn", x: 0.518, y: 0.573, w: 0.142, h: 0.06 },
      { k: "box", x: 0.083, y: 0.689, w: 0.834, h: 0.167 },
      { k: "ring", x: 0.218, y: 0.758, r: 0.024 }, { k: "ring", x: 0.497, y: 0.758, r: 0.024 }, { k: "ring", x: 0.774, y: 0.758, r: 0.024 },
    ],
    notes: [
      { x: 0.16, y: 0.5, to: [0.42, 0.6], text: "call the shop, first thing you see" },
      { x: 0.92, y: 0.3, to: [0.86, 0.04], text: "booking never scrolls away" },
    ],
  },
  idotaxi: {
    marks: [
      { k: "box", x: 0.114, y: 0.024, w: 0.094, h: 0.032 }, { k: "text", x: 0.454, y: 0.031, w: 0.33, h: 0.018, lines: 1 }, { k: "btn", x: 0.806, y: 0.02, w: 0.084, h: 0.042, fill: true },
      { k: "text", x: 0.11, y: 0.2, w: 0.168, h: 0.015, lines: 1 },
      { k: "text", x: 0.11, y: 0.269, w: 0.246, h: 0.064, lines: 1, heavy: true },
      { k: "text", x: 0.11, y: 0.371, w: 0.322, h: 0.062, lines: 2 },
      { k: "btn", x: 0.11, y: 0.484, w: 0.157, h: 0.056, fill: true }, { k: "btn", x: 0.278, y: 0.484, w: 0.115, h: 0.056 },
      { k: "text", x: 0.11, y: 0.589, w: 0.1, h: 0.055, lines: 2 },
      { k: "box", x: 0.568, y: 0.296, w: 0.321, h: 0.242 }, { k: "rule", x: 0.59, y: 0.417, w: 0.28 },
      { k: "text", x: 0.11, y: 0.811, w: 0.779, h: 0.078, lines: 2 },
    ],
    notes: [
      { x: 0.47, y: 0.68, to: [0.19, 0.512], text: "book by WhatsApp, not a form" },
      { x: 0.95, y: 0.7, to: [0.73, 0.5], text: "24/7, said plainly" },
    ],
  },
};

function hand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5);
}
function line(x1: number, y1: number, x2: number, y2: number, j: () => number, amp = 1.4) {
  const mx = (x1 + x2) / 2 + j() * amp * 2, my = (y1 + y2) / 2 + j() * amp * 2;
  return `M${(x1 + j() * amp).toFixed(1)} ${(y1 + j() * amp).toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${(x2 + j() * amp).toFixed(1)} ${(y2 + j() * amp).toFixed(1)}`;
}
function rect(x: number, y: number, w: number, h: number, j: () => number) {
  return [line(x, y, x + w, y, j), line(x + w, y, x + w, y + h, j), line(x + w, y + h, x, y + h, j), line(x, y + h, x, y, j)].join(" ");
}

/** Path data for one project: light strokes, heavy strokes (headlines), and note leaders. */
export function drawingPaths(id: string) {
  const d = drawings[id];
  const j = hand(id.length * 31 + d.marks.length);
  const light: string[] = [], heavy: string[] = [];
  for (const m of d.marks) {
    if (m.k === "ring") { const cx = m.x * W, cy = m.y * H, r = m.r * W; light.push(`M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`); continue; }
    if (m.k === "rule") { light.push(line(m.x * W, m.y * H, (m.x + m.w) * W, m.y * H, j, 0.8)); continue; }
    const x = m.x * W, y = m.y * H, w = m.w * W, h = m.h * H;
    if (m.k === "bar" || m.k === "box" || m.k === "btn") light.push(rect(x, y, w, h, j));
    if (m.k === "img") { light.push(rect(x, y, w, h, j)); light.push(line(x, y, x + w, y + h, j, 2)); light.push(line(x + w, y, x, y + h, j, 2)); }
    if (m.k === "text") {
      const n = m.lines ?? (m.heavy ? 2 : 3);
      for (let i = 0; i < n; i++) {
        const ly = y + (h * (i + 0.5)) / n, lw = w * (i === n - 1 && n > 1 ? 0.62 : 1);
        (m.heavy ? heavy : light).push(line(x, ly, x + lw, ly, j, m.heavy ? 1.2 : 0.8));
      }
    }
  }
  const notes = d.notes.map((n) => ({
    path: line(n.x * W, n.y * H, n.to[0] * W, n.to[1] * H, j, 3),
    dot: [n.to[0] * W, n.to[1] * H] as [number, number],
    label: [n.x * W, n.y * H - 12] as [number, number],
    anchor: (n.x > n.to[0] ? "start" : "end") as "start" | "end",
    text: n.text,
  }));
  return { light: light.join(" "), heavy: heavy.join(" "), notes };
}
