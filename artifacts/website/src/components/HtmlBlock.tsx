import { useEffect, useRef } from "react";

interface HtmlBlockProps {
  html: string;
  className?: string;
}

export function HtmlBlock({ html, className }: HtmlBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const injectedStyles: HTMLElement[] = [];

    doc.querySelectorAll("style").forEach((style) => {
      const s = document.createElement("style");
      s.textContent = style.textContent;
      s.setAttribute("data-ahos-injected", "true");
      document.head.appendChild(s);
      injectedStyles.push(s);
    });

    doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = (link as HTMLLinkElement).href;
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        document.head.appendChild(l);
        injectedStyles.push(l);
      }
    });

    const body = doc.body.cloneNode(true) as HTMLElement;
    body.querySelectorAll("script, style, link").forEach((el) => el.remove());
    ref.current.innerHTML = body.innerHTML;

    const scripts = Array.from(doc.querySelectorAll("script"));
    scripts.forEach((originalScript) => {
      const script = document.createElement("script");
      if ((originalScript as HTMLScriptElement).src) {
        script.src = (originalScript as HTMLScriptElement).src;
      } else {
        script.textContent = originalScript.textContent;
      }
      document.body.appendChild(script);
    });

    return () => {
      injectedStyles.forEach((s) => {
        try { s.remove(); } catch {}
      });
    };
  }, [html]);

  return <div ref={ref} className={className} />;
}
