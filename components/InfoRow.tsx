"use client";
import { useState } from "react";

interface InfoRowProps {
  label: string;
  value: string;
  borderBottom?: boolean;
}

export default function InfoRow({ label, value, borderBottom = true }: InfoRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "1rem 1.5rem",
        borderBottom: borderBottom ? "1px solid var(--border-light)" : "none",
        cursor: "default",
      }}
    >
      {/* Brush fill */}
      <span aria-hidden style={{
        position: "absolute", inset: 0,
        background: "rgba(184,76,30,0.05)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)",
      }} />
      <span style={{
        position: "relative", zIndex: 1,
        fontFamily: "var(--font-body)",
        fontSize: "0.75rem", fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--text-light)",
      }}>
        {label}
      </span>
      <span style={{
        position: "relative", zIndex: 1,
        fontFamily: "var(--font-serif)",
        fontSize: "0.95rem", fontWeight: 600,
        color: hovered ? "var(--accent)" : "var(--text)",
        transition: "color 200ms ease",
      }}>
        {value}
      </span>
    </div>
  );
}
