"use client";
import { useState } from "react";
import Link from "next/link";

type Scheme = "dark" | "dark-on-light" | "light-on-accent" | "white-on-dark";

interface FillButtonProps {
  href: string;
  children: React.ReactNode;
  scheme?: Scheme;
  external?: boolean;
  className?: string;
}

const SCHEMES: Record<Scheme, { bg: string; fill: string; text: string; textHover: string }> = {
  // Default: dark bg, accent fill, light text
  "dark": {
    bg: "var(--text)", fill: "var(--accent)",
    text: "var(--bg)", textHover: "var(--bg)",
  },
  // On dark section: light bg, dark fill
  "dark-on-light": {
    bg: "var(--bg)", fill: "var(--text)",
    text: "var(--text)", textHover: "var(--bg)",
  },
  // On accent/orange section: light bg, near-black fill
  "light-on-accent": {
    bg: "var(--bg)", fill: "#1A1510",
    text: "var(--accent)", textHover: "var(--bg)",
  },
  // On dark bg: white button, accent fill
  "white-on-dark": {
    bg: "rgba(244,239,232,0.12)", fill: "var(--accent)",
    text: "var(--bg)", textHover: "var(--bg)",
  },
};

export default function FillButton({ href, children, scheme = "dark", external, className }: FillButtonProps) {
  const [hovered, setHovered] = useState(false);
  const { bg, fill, text, textHover } = SCHEMES[scheme];

  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: hovered ? textHover : text,
        background: bg,
        padding: "0.85rem 2rem",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        transition: "color 180ms ease",
        border: scheme === "white-on-dark" ? "1px solid rgba(244,239,232,0.2)" : "none",
      }}
    >
      <span aria-hidden style={{
        position: "absolute", inset: 0,
        background: fill,
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 380ms cubic-bezier(0.16,1,0.3,1)",
      }} />
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {children}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: "transform 280ms cubic-bezier(0.34,1.56,0.64,1)",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
          }}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
