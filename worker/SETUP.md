# Make ARIA reliable (10 minutes, free)

ARIA's old free backend (Pollinations) is being deprecated and fails often.
This sets up a rock-solid replacement using Google Gemini's free tier, with the
API key hidden inside a Cloudflare Worker. Both signups are free.

## 1. Get a free Gemini API key
1. Go to https://aistudio.google.com/apikey (sign in with a Google account).
2. Click **Create API key**. Copy it (starts with `AIza...`).

## 2. Create the Cloudflare Worker
1. Go to https://dash.cloudflare.com and sign up / log in (free).
2. Left sidebar: **Workers & Pages** → **Create** → **Create Worker**.
3. Give it a name like `ahos-aria`. Click **Deploy** (it deploys a placeholder).
4. Click **Edit code**. Delete everything in the editor.
5. Open `worker/aria-proxy.js` from this repo, copy all of it, paste it in.
6. Click **Deploy**.

## 3. Add the secret key
1. In the Worker, go to **Settings** → **Variables and Secrets**.
2. Add a **Secret** (not a plain variable):
   - Name: `GEMINI_KEY`
   - Value: the `AIza...` key from step 1
3. Save and **Deploy** again.

## 4. Point the site at the Worker
1. Your Worker has a URL like `https://ahos-aria.YOURNAME.workers.dev`. Copy it.
2. Open `artifacts/website/src/lib/aria.ts`.
3. Paste the URL into `ARIA_WORKER_URL`:
   ```
   const ARIA_WORKER_URL = "https://ahos-aria.YOURNAME.workers.dev";
   ```
4. Commit and push. Done — ARIA now runs on Gemini, reliably.

## Notes
- Free tier limits (Gemini `gemini-2.0-flash`) are generous and fine for a
  launch. If you ever outgrow them, the Worker is where you'd add rate limiting
  or switch models (one line, `MODEL` at the top of `aria-proxy.js`).
- Until `ARIA_WORKER_URL` is set, the site keeps using the old Pollinations
  fallback (with retries + a graceful "reach us" message when it fails).
- The allowed origins are locked to ahos.xyz in the Worker, so nobody else can
  burn your quota from another site.
