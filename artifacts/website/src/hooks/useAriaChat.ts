import { useCallback, useRef, useState } from "react";
import { API_URL, EMAIL_RE, LEAD_RE, MODEL, PREVIEW_RE, WELCOME, fireLead, type Message } from "../lib/aria";

export function useAriaChat(options?: { systemPrompt: string; source: string; maxTokens?: number; onPreview?: (html: string) => void }) {
  const systemPrompt = options?.systemPrompt;
  const source = options?.source ?? "aria_chat";
  const maxTokens = options?.maxTokens ?? 700;
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const historyRef = useRef<Message[]>([{ role: "assistant", content: WELCOME }]);

  const handleLead = useCallback((raw: string): string => {
    const clean = raw.replace(LEAD_RE, "").trim();
    const m = raw.match(LEAD_RE);
    if (m && !leadSent) {
      try {
        const d = JSON.parse(m[1]);
        const hasName = (d.name || "").trim().length > 1;
        const validEmail = EMAIL_RE.test(d.email || "");
        const validPhone = /\d{5,}/.test((d.phone || "").replace(/[\s\-()]/g, ""));
        if (hasName && (validEmail || validPhone)) { fireLead(d, historyRef.current, source); setLeadSent(true); }
      } catch {}
    }
    return clean;
  }, [leadSent, source]);

  const handlePreview = useCallback((raw: string): string => {
    const clean = raw.replace(PREVIEW_RE, "").trim();
    const m = raw.match(PREVIEW_RE);
    if (m && m[1].trim().length > 50) {
      options?.onPreview?.(m[1].trim());
    }
    return clean;
  }, [options]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy || !systemPrompt) return;
    setBusy(true);

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...historyRef.current, userMsg];
    historyRef.current = updated;
    setMessages(updated);
    setInput("");

    // Placeholder assistant message — filled by streaming
    historyRef.current = [...historyRef.current, { role: "assistant", content: "" }];
    setMessages(historyRef.current);

    // One streamed attempt. Throws on any failure (bad status, no body, a
    // timeout, or an empty completion) so the retry loop can try again.
    // `referrer` keeps requests in Pollinations' keyless free tier; without it
    // the legacy endpoint returns intermittent 402 Payment Required.
    const runAttempt = async (): Promise<void> => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(`${API_URL}?referrer=ahos.xyz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            model: MODEL,
            referrer: "ahos.xyz",
            messages: [{ role: "system", content: systemPrompt }, ...updated.slice(-14)],
            max_tokens: maxTokens,
            temperature: 0.72,
            stream: true,
          }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 1);
            if (!line || !line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") { buffer = ""; break; }
            try {
              const parsed = JSON.parse(payload);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                const msgs = [...historyRef.current];
                msgs[msgs.length - 1] = { role: "assistant", content: fullContent };
                historyRef.current = msgs;
                setMessages(msgs);
              }
            } catch {}
          }
        }

        if (!fullContent.trim()) throw new Error("Empty completion");

        const afterPreview = handlePreview(fullContent.trim());
        const clean = handleLead(afterPreview);
        if (clean) {
          const msgs = [...historyRef.current];
          msgs[msgs.length - 1] = { role: "assistant", content: clean };
          historyRef.current = msgs;
          setMessages(msgs);
        }
      } finally {
        clearTimeout(timer);
      }
    };

    // Retry through Pollinations' intermittent 402/500s before giving up.
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      if (attempt > 0) {
        // Reset the pending bubble (show the typing dots again) and back off.
        const msgs = [...historyRef.current];
        msgs[msgs.length - 1] = { role: "assistant", content: "" };
        historyRef.current = msgs;
        setMessages(msgs);
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
      try { await runAttempt(); ok = true; } catch {}
    }

    if (!ok) {
      // Never leave a visitor at a dead end: replace the pending bubble with a
      // graceful message that still routes them to a real person.
      const fallback = "Looks like I'm having a brief connection hiccup. The quickest way to reach the team is email at info@ahos.xyz or WhatsApp at +961 70 165 601, and someone replies within 24 hours. You can also send your message again in a moment.";
      const msgs = [...historyRef.current];
      if (msgs.length && msgs[msgs.length - 1].role === "assistant" && !msgs[msgs.length - 1].content) {
        msgs[msgs.length - 1] = { role: "assistant", content: fallback };
      } else {
        msgs.push({ role: "assistant", content: fallback });
      }
      historyRef.current = msgs;
      setMessages(msgs);
    }

    setBusy(false);
  }, [busy, handleLead, handlePreview, systemPrompt, maxTokens]);

  const newChat = useCallback(() => {
    historyRef.current = [{ role: "assistant", content: WELCOME }];
    setMessages(historyRef.current);
    setLeadSent(false);
    setBusy(false);
    setInput("");
  }, []);

  return { messages, input, setInput, busy, leadSent, sendMessage, newChat };
}
