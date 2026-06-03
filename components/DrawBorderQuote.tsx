"use client";
import { useInView } from "@/hooks/useInView";

interface DrawBorderQuoteProps {
  quote: string;
  attribution: string;
  textColor?: string;
  attributionColor?: string;
}

export default function DrawBorderQuote({
  quote,
  attribution,
  textColor = "var(--bg)",
  attributionColor = "rgba(244,239,232,0.4)",
}: DrawBorderQuoteProps) {
  const [ref, inView] = useInView(0.3);

  return (
    <div ref={ref} style={{ position: "relative", paddingLeft: "2rem" }}>
      {/* Border draws downward */}
      <div aria-hidden style={{
        position: "absolute",
        left: 0, top: 0,
        width: "3px",
        height: inView ? "100%" : "0%",
        background: "var(--accent)",
        transition: "height 700ms cubic-bezier(0.16,1,0.3,1) 300ms",
      }} />

      {/* Decorative large quote mark */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-1.5rem", left: "1.5rem",
        fontFamily: "var(--font-serif)",
        fontSize: "8rem", lineHeight: 1,
        color: "rgba(244,239,232,0.06)",
        fontWeight: 700,
        pointerEvents: "none", userSelect: "none",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 600ms ease 500ms, transform 600ms ease 500ms",
      }}>
        "
      </div>

      <blockquote style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(1.25rem, 2.5vw, 1.65rem)",
        fontWeight: 400, fontStyle: "italic",
        color: textColor,
        lineHeight: 1.55, marginBottom: "1.25rem",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 600ms ease 400ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 400ms",
      }}>
        {quote}
      </blockquote>

      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.7rem", fontWeight: 600,
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: attributionColor,
        opacity: inView ? 1 : 0,
        transition: "opacity 400ms ease 700ms",
      }}>
        {attribution}
      </div>
    </div>
  );
}
