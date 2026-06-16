import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "grid", gap: "12px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${open === i ? "var(--border-hover)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-card)",
            overflow: "hidden",
            transition: "border-color 0.3s ease",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              padding: "20px 24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              fontSize: "16px",
              fontWeight: 600,
              textAlign: "left",
              fontFamily: "var(--font-sans)",
              lineHeight: 1.4,
            }}
          >
            <span>{item.question}</span>
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: open === i ? "var(--orange)" : "var(--bg-card-hover)",
                color: open === i ? "#fff" : "var(--text-muted)",
                fontSize: "16px",
                fontWeight: 700,
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}
            >
              {open === i ? "−" : "+"}
            </span>
          </button>
          <div
            style={{
              maxHeight: open === i ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.4s ease, padding 0.3s ease",
              padding: open === i ? "0 24px 20px" : "0 24px",
            }}
          >
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "15px" }}>
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
