"use client";

import { useState } from "react";
import FillButton from "@/components/FillButton";
import MaskHeadline from "@/components/MaskHeadline";
import SectionHeader from "@/components/SectionHeader";
import DrawBorderQuote from "@/components/DrawBorderQuote";
import { useInView } from "@/hooks/useInView";

// ─── Spotlight card for the Four Pillars grid ─────────────────────────────────
const PILLARS = [
  { title: "The Word",        body: "Every session is anchored in expository Bible teaching. We take God's Word as the ultimate authority on every question men face." },
  { title: "The Table",       body: "Teaching is followed by lively table discussion led by dedicated table leaders. Real questions, real conversation." },
  { title: "The Brotherhood", body: "Friendships built on accountability and prayer. The kind of relationship that only forms when men show up consistently." },
  { title: "The Truth",       body: "We seek One Thing from the Word each week — a biblical truth that exposes the lies men live with and offers a better way." },
];

function PillarCard({ title, body, index, activeIndex, onEnter, onLeave }: {
  title: string; body: string; index: number;
  activeIndex: number | null; onEnter: () => void; onLeave: () => void;
}) {
  const [ref, inView] = useInView();
  const hovered = activeIndex === index;
  const dimmed  = activeIndex !== null && !hovered;
  const isRight = index % 2 === 1;
  const isBottom = index >= 2;

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        padding: "2.5rem 2rem",
        borderTop: "2px solid var(--border)",
        borderLeft: "2px solid var(--border)",
        borderRight: isRight ? "2px solid var(--border)" : "none",
        borderBottom: isBottom ? "2px solid var(--border)" : "none",
        borderLeftColor: hovered ? "var(--accent)" : "var(--border)",
        background: hovered ? "rgba(184,76,30,0.03)" : "var(--bg-surface)",
        opacity: dimmed ? 0.5 : 1,
        filter: dimmed ? "grayscale(0.2)" : "none",
        transition: ["border-left-color 200ms ease","background 220ms ease","opacity 260ms ease","filter 260ms ease",`transform 550ms cubic-bezier(0.16,1,0.3,1) ${index * 70}ms`].join(", "),
        transform: inView ? "translateY(0)" : "translateY(24px)",
        cursor: "default",
      }}
    >
      <h3 style={{
        fontFamily: "var(--font-display)",
        fontSize: "2rem", letterSpacing: "0.04em",
        color: hovered ? "var(--accent)" : "var(--text)",
        marginBottom: "0.75rem",
        transform: hovered ? "scale(1.04) translateX(3px)" : "scale(1) translateX(0)",
        transformOrigin: "left center",
        transition: "color 180ms ease, transform 260ms cubic-bezier(0.34,1.56,0.64,1)",
        display: "inline-block",
      }}>
        {title.toUpperCase()}
      </h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 550ms ease ${delay}ms, transform 550ms cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function SlideIn({ children, from = "left", delay = 0 }: { children: React.ReactNode; from?: "left"|"right"; delay?: number }) {
  const [ref, inView] = useInView();
  const tx = from === "left" ? "-24px" : "24px";
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : `translateX(${tx})`, transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Details table ─────────────────────────────────────────────────────────────
function DetailRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "0.75rem 0",
        borderBottom: last ? "none" : "1px solid var(--border-light)",
        cursor: "default",
      }}
    >
      <span aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(184,76,30,0.05)", transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center", transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)" }} />
      <span style={{ position: "relative", zIndex: 1, fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-light)" }}>{label}</span>
      <span style={{ position: "relative", zIndex: 1, fontFamily: "var(--font-serif)", fontSize: "0.9rem", color: hovered ? "var(--accent)" : "var(--text)", transition: "color 200ms ease", textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function AboutContent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      {/* ── Header ── */}
      <section style={{ padding: "5rem 1.5rem 4rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>About</div>
          </FadeUp>
          <MaskHeadline lines={["ONE THING", "SINCE 2009"]} size="clamp(3rem, 8vw, 6.5rem)" as="h1" />
          <FadeUp delay={300}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.05rem, 2vw, 1.3rem)", fontStyle: "italic", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "600px", marginTop: "2rem" }}>
              Spurring men on to a closer walk with God through biblical truth, honest conversation, and unshakeable brotherhood.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <SlideIn from="left">
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>Our Mission</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", marginBottom: "1.5rem" }}>We are comprised of like-minded men whose desire is to work together serving God and others.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "1.25rem" }}>Our mission is simple: to spur men on to a closer walk with God. We do that through applicable, expository teaching coupled with lively interaction and table discussion. The format is intentional — because truth changes men when it&apos;s not just heard, but wrestled with.</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.8 }}>Every week we seek &quot;One Thing from the Word&quot; — a single biblical truth that exposes the lies men live with and points toward something better.</p>
          </SlideIn>

          <SlideIn from="right" delay={100}>
            <div style={{ border: "2px solid var(--border)", padding: "2.5rem", background: "var(--bg-surface)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "1.5rem" }}>The Details</div>
              {[
                { label: "Founded",      value: "2009" },
                { label: "Organization", value: "One Thing Ministries, Inc." },
                { label: "Status",       value: "501(c)(3) Non-Profit" },
                { label: "Staff",        value: "Volunteer-driven, no salaries" },
                { label: "Format",       value: "Teaching + Table Discussion" },
                { label: "Schedule",     value: "Labor Day through Memorial Day" },
                { label: "Location",     value: "Alpharetta, Georgia" },
                { label: "Online",       value: "Zoom groups available" },
              ].map((item, i, arr) => <DetailRow key={item.label} {...item} last={i === arr.length - 1} />)}
            </div>
          </SlideIn>
        </div>
      </section>

      {/* ── Four Pillars ── */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "2px solid var(--border)", background: "var(--bg-surface)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="What We're Built On" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.title} {...p} index={i} activeIndex={activeIndex} onEnter={() => setActiveIndex(i)} onLeave={() => setActiveIndex(null)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Scripture ── */}
      <section style={{ padding: "6rem 1.5rem", borderBottom: "2px solid var(--border)", background: "var(--bg-dark)" }}>
        <div className="max-w-3xl mx-auto">
          <DrawBorderQuote
            quote='"As iron sharpens iron, so one person sharpens another."'
            attribution="Proverbs 27:17"
          />
        </div>
      </section>

      {/* ── Online groups ── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader label="Beyond Alpharetta" />
          <SlideIn from="left">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem" }}>Online groups available worldwide.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2rem" }}>Can&apos;t make it to Alpharetta on Fridays? One Thing for Men runs online Zoom groups and provides small group resources for men everywhere who want to pursue the same kind of accountability and biblical depth from wherever they are.</p>
            <FillButton href="/contact" scheme="dark">Get Connected</FillButton>
          </SlideIn>
        </div>
      </section>
    </>
  );
}
