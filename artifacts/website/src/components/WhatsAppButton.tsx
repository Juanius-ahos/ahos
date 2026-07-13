import { useEffect, useState } from "react";

const WA = "https://wa.me/96170165601";

export function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{css}</style>
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className={`wa-btn ${show ? "is-on" : ""}`}
        aria-label="Chat on WhatsApp — +961 70 165 601"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.55 3.653 1.5 5.147L2 22l4.853-1.5A9.98 9.98 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white" />
          <path d="M17.1 14.2c-.3-.15-1.6-.8-1.85-.9-.25-.1-.45-.15-.65.15-.2.3-.75.9-.9 1.05-.15.2-.35.2-.65.05-.3-.15-1.15-.45-2.2-1.4-.8-.7-1.35-1.55-1.5-1.8-.15-.25 0-.35.15-.5.15-.15.25-.35.35-.5.1-.15.15-.3.2-.4.05-.15.0-.3-.05-.4-.05-.1-.6-1.5-.85-2.05-.2-.5-.45-.45-.65-.45l-.55-.05c-.2 0-.5.05-.75.35-.25.3-.95.95-.95 2.3 0 1.35.95 2.65 1.1 2.85.15.2 1.9 2.95 4.6 4.1 1.75.75 2.2.85 2.95.75.65-.1 1.05-.45 1.2-.85.15-.4.65-1.7.8-2.1.15-.4.1-.65-.05-.75z" fill="#25d366" />
        </svg>
        <span className="wa-label">Chat on WhatsApp</span>
      </a>
    </>
  );
}

const css = `
.wa-btn {
  position: fixed; left: 20px; bottom: 24px; z-index: 899;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px 12px 14px;
  border-radius: 999px;
  background: #25d366;
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transform: translateY(160%);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease, box-shadow 0.2s;
  pointer-events: none;
}
.wa-btn.is-on { transform: translateY(0); opacity: 1; pointer-events: auto; }
.wa-btn:hover { box-shadow: 0 6px 28px rgba(37, 211, 102, 0.55); }
.wa-btn svg { flex-shrink: 0; }
.wa-label { white-space: nowrap; }

@media (max-width: 560px) {
  .wa-btn { left: 12px; bottom: 80px; padding: 10px 14px 10px 10px; gap: 8px; }
  .wa-btn svg { width: 20px; height: 20px; }
  .wa-label { font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .wa-btn { transition: opacity 0.3s ease; }
}
`;
