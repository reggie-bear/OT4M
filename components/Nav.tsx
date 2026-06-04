"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import CountdownBanner from "@/components/CountdownBanner";

const links = [
  { href: "/about", label: "About" },
  { href: "/messages", label: "Messages" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        fontFamily: "var(--font-body)",
        fontSize: "0.8rem",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: active ? "var(--accent)" : hovered ? "var(--text)" : "var(--text-muted)",
        textDecoration: "none",
        transition: "color 180ms ease",
        paddingBottom: "2px",
      }}
    >
      {label}
      {/* Animated underline */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: -2,
          height: "2px",
          background: active ? "var(--accent)" : "var(--text)",
          width: "100%",
          transformOrigin: "left center",
          transform: `scaleX(${active ? 1 : hovered ? 1 : 0})`,
          transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [joinHovered, setJoinHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--bg)",
        borderBottom: "2px solid var(--border)",
        transition: "box-shadow 250ms ease",
        boxShadow: scrolled ? "0 4px 24px rgba(26,21,16,0.08)" : "none",
      }}
    >
      <CountdownBanner />
      <div
        className="max-w-6xl mx-auto px-6 flex items-center justify-between"
        style={{ height: "64px" }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "block" }} aria-label="One Thing for Men — Home">
          <img
            src="/ot4m-logo.png"
            alt="One Thing for Men"
            style={{
              height: "48px",
              width: "auto",
              display: "block",
              mixBlendMode: "multiply",
            }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              active={pathname === l.href}
            />
          ))}

          {/* CTA button with lift */}
          <Link
            href="/contact"
            onMouseEnter={() => setJoinHovered(true)}
            onMouseLeave={() => setJoinHovered(false)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--bg)",
              background: joinHovered ? "var(--accent)" : "var(--text)",
              padding: "0.5rem 1.25rem",
              textDecoration: "none",
              transition: "background 200ms ease, transform 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms ease",
              transform: joinHovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: joinHovered ? "0 6px 20px rgba(184,76,30,0.3)" : "none",
              display: "inline-block",
            }}
          >
            Join Us
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {[
            open ? "translateY(6px) rotate(45deg)" : "none",
            undefined,
            open ? "translateY(-6px) rotate(-45deg)" : "none",
          ].map((transform, i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: "var(--text)",
                transition: "transform 220ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease",
                transform: transform ?? "none",
                opacity: i === 1 && open ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer — slides down */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "400px" : "0",
          transition: "max-height 320ms cubic-bezier(0.16, 1, 0.3, 1)",
          borderTop: open ? "1px solid var(--border-light)" : "none",
          background: "var(--bg)",
        }}
      >
        <div style={{ padding: "1.5rem 1.5rem 2rem" }}>
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: pathname === l.href ? "var(--accent)" : "var(--text)",
                textDecoration: "none",
                padding: "0.85rem 0",
                borderBottom: "1px solid var(--border-light)",
                transition: "color 150ms ease",
                animation: open ? `mobileNavIn 280ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` : "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--bg)",
              background: "var(--text)",
              padding: "0.75rem 2rem",
              textDecoration: "none",
              animation: open ? "mobileNavIn 280ms cubic-bezier(0.16,1,0.3,1) 120ms both" : "none",
            }}
          >
            Join Us Friday
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </header>
  );
}
