"use client";

import { useState } from "react";
import MessagesSearch from "@/components/MessagesSearch";
import CountUp from "@/components/CountUp";
import DrawBorderQuote from "@/components/DrawBorderQuote";
import FillButton from "@/components/FillButton";
import MaskHeadline from "@/components/MaskHeadline";
import SectionHeader from "@/components/SectionHeader";
import { useInView } from "@/hooks/useInView";

// ─── ScheduleRow — 2-col grid cell with paint-brush hover ────────────────────
function ScheduleRow({ label, value, borderRight, borderBottom }: {
  label: string; value: string; borderRight?: boolean; borderBottom?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        padding: "1.25rem 1.5rem",
        borderRight: borderRight ? "2px solid var(--border)" : undefined,
        borderBottom: borderBottom ? "2px solid var(--border)" : undefined,
        cursor: "default",
      }}
    >
      <span aria-hidden style={{
        position: "absolute", inset: 0,
        background: "rgba(184,76,30,0.055)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 320ms cubic-bezier(0.16,1,0.3,1)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.35rem" }}>{label}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: hovered ? "var(--accent)" : "var(--text)", transition: "color 220ms ease" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── HowItWorksCard — spotlight-aware ────────────────────────────────────────
const HOW_IT_WORKS = [
  { number: "01", title: "Show Up",        body: "Doors open at 6:30 AM every Friday. Greeters will meet you at the door. No reservation, no preparation required." },
  { number: "02", title: "Dig In",         body: "Expository teaching straight from Scripture, followed by table discussion. One thing from the Word, every week." },
  { number: "03", title: "Walk Different", body: "Leave with brotherhood, accountability, and something concrete to apply. Men have been doing this since 2009." },
];

function HowItWorksCard({ number, title, body, index, activeIndex, onEnter, onLeave }: typeof HOW_IT_WORKS[0] & {
  index: number; activeIndex: number | null; onEnter: () => void; onLeave: () => void;
}) {
  const [ref, inView] = useInView();
  const hovered = activeIndex === index;
  const dimmed  = activeIndex !== null && !hovered;

  return (
    <div ref={ref} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
      padding: "2.5rem 2rem",
      border: "2px solid var(--border)",
      borderLeft: `2px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
      marginLeft: index > 0 ? "-2px" : 0,
      background: hovered ? "rgba(184,76,30,0.03)" : "transparent",
      opacity: dimmed ? 0.48 : 1,
      filter: dimmed ? "grayscale(0.25)" : "none",
      transition: ["border-left-color 200ms ease","background 200ms ease","opacity 280ms ease","filter 280ms ease",`transform 600ms cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`].join(", "),
      transform: inView ? "translateY(0)" : "translateY(28px)",
      cursor: "default", height: "100%", position: "relative",
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "3.5rem", lineHeight: 1,
        color: hovered ? "var(--accent)" : "var(--border-light)", marginBottom: "1rem",
        transform: hovered ? "scale(1.06) translateY(-2px)" : "scale(1) translateY(0)",
        transformOrigin: "left center",
        transition: "color 180ms ease, transform 280ms cubic-bezier(0.34,1.56,0.64,1)",
        display: "inline-block", opacity: inView ? 1 : 0,
      }}>{number}</div>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.85rem", letterSpacing: hovered ? "0.02em" : "0", transition: "letter-spacing 300ms ease" }}>{title}</h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}

// ─── Staggered letter reveal for CTA ─────────────────────────────────────────
function CTAHeadline() {
  const [ref, inView] = useInView(0.2);
  const text = "JUST SHOW UP";
  return (
    <h2 ref={ref} aria-label={text} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 0.9, letterSpacing: "0.01em", color: "var(--bg)", marginBottom: "1.25rem" }}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
          {word.split("").map((char, ci) => {
            const gi = text.split(" ").slice(0, wi).join("").length + wi + ci;
            return <span key={ci} style={{ display: "inline-block", transform: inView ? "translateY(0)" : "translateY(110%)", transition: `transform 650ms cubic-bezier(0.16,1,0.3,1) ${gi * 28}ms` }}>{char}</span>;
          })}
        </span>
      ))}
    </h2>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(14px)", transition: `opacity 500ms ease ${delay}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function SlideIn({ children, delay = 0, from = "left" }: { children: React.ReactNode; delay?: number; from?: "left" | "right" }) {
  const [ref, inView] = useInView();
  const tx = from === "left" ? "-28px" : "28px";
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : `translateX(${tx})`, transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function MapEmbed() {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{ border: "2px solid var(--border)", overflow: "hidden", aspectRatio: "4/3", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(24px)", transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 100ms" }}>
      <iframe src="https://maps.google.com/maps?q=410+Rucker+Road+Alpharetta+GA&output=embed" width="100%" height="100%" style={{ border: 0, display: "block" }} loading="lazy" title="One Thing for Men — 410 Rucker Road, Alpharetta GA" />
    </div>
  );
}

const STATS = [
  { value: "2009", label: "Founded" },
  { value: "Friday", label: "Every week" },
  { value: "7 AM", label: "Gather" },
  { value: "Free", label: "Always" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeCard, setActive] = useState<number | null>(null);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ minHeight: "calc(100vh - var(--header-height))", display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem 1.5rem 3rem", borderBottom: "2px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "url('/bible-bg.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07, filter: "sepia(0.55) brightness(1.12) contrast(0.82)", WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 50% 48%, black 18%, rgba(0,0,0,0.55) 52%, transparent 78%)", maskImage: "radial-gradient(ellipse 72% 68% at 50% 48%, black 18%, rgba(0,0,0,0.55) 52%, transparent 78%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", pointerEvents: "none", opacity: 0.6 }} />

        <div className="max-w-3xl mx-auto w-full" style={{ position: "relative" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem", animation: "fadeUp 700ms cubic-bezier(0.16,1,0.3,1) both" }}>Alpharetta, Georgia · Est. 2009</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 9vw, 8rem)", lineHeight: 0.9, letterSpacing: "0.01em", color: "var(--text)", marginBottom: "1.5rem", animation: "heroReveal 800ms cubic-bezier(0.16,1,0.3,1) 80ms both" }}>SPURRING<br />MEN ON</h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 400, fontStyle: "italic", color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: 1.35, animation: "fadeUp 700ms cubic-bezier(0.16,1,0.3,1) 200ms both" }}>to a closer walk with God</p>
          <div style={{ animation: "fadeUp 700ms cubic-bezier(0.16,1,0.3,1) 320ms both" }}>
            <MessagesSearch />
          </div>
        </div>

        <div className="max-w-3xl mx-auto w-full" style={{ marginTop: "4rem", display: "flex", flexWrap: "wrap", gap: "2rem 3rem", animation: "fadeUp 700ms cubic-bezier(0.16,1,0.3,1) 480ms both", position: "relative" }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", lineHeight: 1, color: "var(--text)", letterSpacing: "0.02em" }}><CountUp target={s.value} /></div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)", marginTop: "0.2rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes heroReveal { from { opacity:0; transform:translateY(32px) skewY(1deg); } to { opacity:1; transform:translateY(0) skewY(0deg); } }
        `}</style>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ borderBottom: "2px solid var(--border)", padding: "5rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="How It Works" />
          <div className="grid grid-cols-1 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <HowItWorksCard key={item.number} {...item} index={i} activeIndex={activeCard} onEnter={() => setActive(i)} onLeave={() => setActive(null)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT DARK STRIP ── */}
      <section style={{ borderBottom: "2px solid var(--border)", padding: "5rem 1.5rem", background: "var(--bg-dark)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <SlideIn from="left">
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>Who We Are</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15, color: "var(--bg)", marginBottom: "1.5rem" }}>Like-minded men working together, serving God and others.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(244,239,232,0.6)", lineHeight: 1.8, marginBottom: "2rem" }}>Since 2009, One Thing for Men has gathered men every Friday morning for expository Bible teaching, honest conversation, and the kind of accountability that only happens when men decide to show up consistently. No paid staff. No overhead. Just men serious about God.</p>
            <FillButton href="/about" scheme="dark-on-light">Our Story</FillButton>
          </SlideIn>
          <SlideIn from="right" delay={120}>
            <DrawBorderQuote quote='"As iron sharpens iron, so one person sharpens another."' attribution="Proverbs 27:17" />
          </SlideIn>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>Find Us</div>
            <div style={{ marginBottom: "2rem" }}>
              <MaskHeadline lines={["EVERY", "FRIDAY", "MORNING"]} size="clamp(2.5rem, 6vw, 5rem)" as="h2" />
            </div>
            <div style={{ border: "2px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: "1.5rem", overflow: "hidden" }}>
              <ScheduleRow label="Doors Open" value="6:30 AM"               borderRight borderBottom />
              <ScheduleRow label="Teaching"   value="7:00 AM"               borderBottom />
              <ScheduleRow label="Ends"       value="8:00 AM"               borderRight />
              <ScheduleRow label="Season"     value="Labor Day–Memorial Day" />
            </div>
            <FadeUp delay={160}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.8 }}>Building 300 · 410 Rucker Road · Alpharetta, GA<br />Behind Restoration Church. Greeters will meet you at the door.</p>
            </FadeUp>
          </div>
          <MapEmbed />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--accent)", borderBottom: "2px solid var(--border)", overflow: "hidden", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {[0,1,2].map(i => <div key={i} style={{ position: "absolute", top: `${20+i*30}%`, left: "-10%", width: "120%", height: "1px", background: "rgba(244,239,232,0.1)", transform: `rotate(${-2+i*2}deg)`, animation: `ctaLine 4s ease-in-out ${i*0.8}s infinite alternate` }} />)}
        </div>
        <div className="max-w-3xl mx-auto text-center" style={{ position: "relative" }}>
          <CTAHeadline />
          <FadeUp delay={200}><p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontStyle: "italic", color: "rgba(244,239,232,0.88)", marginBottom: "2.5rem" }}>Our greeters will roll out the red carpet.</p></FadeUp>
          <FadeUp delay={350}><FillButton href="/contact" scheme="light-on-accent">Get Directions</FillButton></FadeUp>
        </div>
        <style>{`@keyframes ctaLine { from{transform:rotate(-2deg) translateX(0);} to{transform:rotate(-2deg) translateX(2%);} }`}</style>
      </section>
    </>
  );
}
