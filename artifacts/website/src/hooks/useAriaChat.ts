import { useCallback, useRef, useState } from "react";
import { API_URL, EMAIL_RE, LEAD_RE, MODEL, PREVIEW_RE, WELCOME, fireLead, type Message } from "../lib/aria";

export function useAriaChat(options?: { systemPrompt: string; source: string; onPreview?: (html: string) => void }) {
  const systemPrompt = options?.systemPrompt;
  const source = options?.source ?? "aria_chat";
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

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: systemPrompt }, ...updated.slice(-14)],
          max_tokens: 700,
          temperature: 0.72,
          stream: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error((errData?.error?.message) || "HTTP " + res.status);
      }

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

      // Stream complete — process markers
      const afterPreview = handlePreview(fullContent.trim());
      const clean = handleLead(afterPreview);
      if (clean) {
        const msgs = [...historyRef.current];
        msgs[msgs.length - 1] = { role: "assistant", content: clean };
        historyRef.current = msgs;
        setMessages(msgs);
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Connection issue";
      const ariaMsg: Message = { role: "assistant", content: "Sorry, I hit a snag — " + errMsg + ". Please try again in a moment." };
      historyRef.current = [...historyRef.current, ariaMsg];
      setMessages(historyRef.current);
    }

    setBusy(false);
  }, [busy, handleLead, handlePreview, systemPrompt]);

  const newChat = useCallback(() => {
    historyRef.current = [{ role: "assistant", content: WELCOME }];
    setMessages(historyRef.current);
    setLeadSent(false);
    setBusy(false);
    setInput("");
  }, []);

  return { messages, input, setInput, busy, leadSent, sendMessage, newChat };
}
