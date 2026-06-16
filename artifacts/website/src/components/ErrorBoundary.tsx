import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", padding: "80px 24px", textAlign: "center", gap: 12, fontFamily: "var(--font-sans)" }}>
          <span style={{ fontSize: 32 }}>!</span>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "var(--text)", margin: 0, fontFamily: "var(--font-display)" }}>Something went wrong</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 400, fontSize: 14, lineHeight: 1.6 }}>This page hit an unexpected error. Try refreshing, or head back home.</p>
          <a href="/" style={{ marginTop: 8, display: "inline-flex", padding: "10px 24px", borderRadius: 999, background: "var(--orange)", color: "#0a0a0b", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>Go home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
