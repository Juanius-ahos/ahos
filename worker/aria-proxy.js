/**
 * ARIA proxy — a tiny Cloudflare Worker that powers the AHOS site's AI advisor.
 *
 * Why this exists: the site is static (GitHub Pages), so it can't hold a secret
 * API key. This Worker holds the key server-side and calls Google Gemini (which
 * has a genuinely free tier), then streams the reply back to the browser in the
 * same OpenAI-style SSE shape the site already parses. So the frontend needs
 * only one change: point ARIA_WORKER_URL at this Worker's URL.
 *
 * Setup lives in worker/SETUP.md. In short:
 *   1. Get a free Gemini API key at https://aistudio.google.com/apikey
 *   2. Create a Worker at https://dash.cloudflare.com (Workers & Pages).
 *   3. Paste this file in, add a Secret named GEMINI_KEY, and Deploy.
 *   4. Copy the Worker URL into ARIA_WORKER_URL in artifacts/website/src/lib/aria.ts
 */

const MODEL = "gemini-2.0-flash"; // fast + free tier; swap to gemini-2.5-flash later if you like
const ALLOWED_ORIGINS = ["https://ahos.xyz", "https://www.ahos.xyz", "http://localhost:5173"];

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : "https://ahos.xyz";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers });
    if (!env.GEMINI_KEY) return new Response("Server not configured", { status: 500, headers });

    let body;
    try { body = await request.json(); } catch { return new Response("Bad request", { status: 400, headers }); }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const systemText = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const contents = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content || "") }] }));

    const geminiBody = {
      contents,
      generationConfig: {
        temperature: typeof body.temperature === "number" ? body.temperature : 0.72,
        maxOutputTokens: typeof body.max_tokens === "number" ? body.max_tokens : 700,
      },
    };
    if (systemText) geminiBody.systemInstruction = { parts: [{ text: systemText }] };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${env.GEMINI_KEY}`;

    let upstream;
    try {
      upstream = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      });
    } catch {
      return new Response("Upstream error", { status: 502, headers });
    }

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream error " + upstream.status, { status: 502, headers });
    }

    // Translate Gemini's SSE stream into the OpenAI delta shape the site parses:
    //   data: {"choices":[{"delta":{"content":"..."}}]}\n\n ... data: [DONE]
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (!json || json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const text = parsed?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
            if (text) {
              const out = JSON.stringify({ choices: [{ delta: { content: text } }] });
              controller.enqueue(encoder.encode("data: " + out + "\n\n"));
            }
          } catch { /* skip partial lines */ }
        }
      },
      cancel() { reader.cancel(); },
    });

    return new Response(stream, {
      headers: { ...headers, "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache" },
    });
  },
};
