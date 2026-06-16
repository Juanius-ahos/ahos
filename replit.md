# AHOS - Digital Product Studio

A full rebuild of www.ahos.xyz as a clean, editable React + Vite web app. All 6 pages extracted directly from the live Dynadot site, now fully editable in code.

## Run & Operate

- `pnpm --filter @workspace/website run dev` — run the website (port 19161, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: React + Vite + Wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (not yet used by website)

## Where things live

- `artifacts/website/src/pages/` — one file per page (Home, Services, Web3, Careers, Contact, AriaAI)
- `artifacts/website/src/data/` — raw HTML content blocks per page (edit these to change content)
- `artifacts/website/src/components/` — Nav, Footer, GlobalBackground, HtmlBlock
- `artifacts/api-server/src/routes/` — API routes

## Pages

| Route | File | Data |
|-------|------|------|
| `/` | `pages/Home.tsx` | `data/home.ts` |
| `/services` | `pages/Services.tsx` | `data/services.ts` |
| `/web3` | `pages/Web3.tsx` | `data/web3.ts` |
| `/careers` | `pages/Careers.tsx` | `data/careers.ts` |
| `/contact` | `pages/Contact.tsx` | `data/contact.ts` |
| `/aria-ai` | `pages/AriaAI.tsx` | `data/aria.ts` |

## How to edit content

Each page's content is stored as raw HTML strings in `src/data/<page>.ts`. Edit those strings to update text, styles, and structure. Shared elements (nav, footer, background) are in `src/components/`.

## Architecture decisions

- Content blocks are stored as raw HTML strings in TypeScript data files — easy to find and edit
- `HtmlBlock` component handles injecting `<style>` tags into `<head>` and executing `<script>` tags via `useEffect`
- `GlobalBackground` renders the shared stars/nebula/grid canvas animation on every page
- Navigation is a custom React component using Wouter for client-side routing
- All canvas animations (galaxy, constellation, stars, cursor trail) run as-is from the original site

## User preferences

- Website rebuilt from www.ahos.xyz (Dynadot) into a GitHub-friendly React codebase

## Gotchas

- After editing content in `src/data/*.ts`, the Vite dev server hot-reloads automatically
- The `HtmlBlock` component re-runs scripts on mount — if a script has side effects, they run on page navigation
- The ARIA AI page calls the Groq API directly from the browser (built into the original HTML block)
