import { useState } from "react";

/**
 * "What's slowing you down?" audit section — matches weevolveit.com.
 * Eyebrow, title, subtitle, live counter, text input form.
 */
export function AuditSection() {
  const [value, setValue] = useState("");

  return (
    <section className="audit-section">
      <style>{css}</style>
      <div className="audit-inner">
        <span className="audit-eyebrow">[ the audit ]</span>
        <h2 className="audit-title">What's slowing you down?</h2>
        <p className="audit-sub">
          You name the friction. We map the fix.<br />
          See what happens next...
        </p>
        <div className="audit-live">
          <span className="audit-pulse">
            <span className="audit-pulse-ring" />
            <span className="audit-pulse-dot" />
          </span>
          <span className="audit-live-text">live</span>
          <span className="audit-stat">183 · frictions diagnosed</span>
        </div>
        <form className="audit-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder=""
            spellCheck={false}
            autoComplete="off"
            aria-label="Describe your own business pain"
            className="audit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="audit-submit" aria-label="Submit" disabled={!value}>
            →
          </button>
        </form>
      </div>
    </section>
  );
}

const css = `
.audit-section {
  position: relative;
  z-index: 10;
  padding: clamp(80px, 12vh, 140px) var(--gutter);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.audit-inner {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.audit-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-dim);
}
.audit-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5.5vw, 72px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--text);
}
.audit-sub {
  font-family: var(--font-mono);
  font-size: clamp(14px, 1.4vw, 16px);
  line-height: 1.6;
  color: var(--text-muted);
}
.audit-live {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.audit-pulse {
  position: relative;
  width: 8px;
  height: 8px;
}
.audit-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--orange);
  animation: audit-pulse 2s ease-in-out infinite;
}
.audit-pulse-dot {
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  background: var(--orange);
}
.audit-live-text {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--orange);
}
.audit-stat {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.audit-form {
  display: flex;
  width: 100%;
  max-width: 420px;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.2s, background 0.2s;
}
.audit-form:focus-within {
  border-color: var(--border-hover);
  background: rgba(255,255,255,0.035);
}
.audit-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text);
}
.audit-input::placeholder { color: var(--text-dim); }
.audit-submit {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 14px;
  cursor: default;
  transition: color 0.2s, background 0.2s, transform 0.2s, opacity 0.2s;
  opacity: 0.4;
}
.audit-form:has(.audit-input:not(:placeholder-shown)) .audit-submit {
  cursor: pointer;
  opacity: 1;
  color: var(--text);
  background: var(--orange);
}
@keyframes audit-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(2.2); }
}
@media (max-width: 600px) {
  .audit-section { padding: clamp(60px, 10vh, 100px) var(--gutter); }
  .audit-title { font-size: clamp(28px, 9vw, 42px); }
}
`;
