"use client";

import { useState } from "react";
import FillButton from "@/components/FillButton";
import MaskHeadline from "@/components/MaskHeadline";
import SectionHeader from "@/components/SectionHeader";
import InfoRow from "@/components/InfoRow";
import { useInView } from "@/hooks/useInView";

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

function MapEmbed() {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{ border: "2px solid var(--border)", overflow: "hidden", aspectRatio: "4/3", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(24px)", transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 100ms" }}>
      <iframe src="https://maps.google.com/maps?q=410+Rucker+Road+Alpharetta+GA&output=embed" width="100%" height="100%" style={{ border: 0, display: "block" }} loading="lazy" title="One Thing for Men — 410 Rucker Road, Alpharetta GA" />
    </div>
  );
}

function SocialLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: hovered ? "var(--accent)" : "var(--text-muted)", textDecoration: "none", transition: "color 180ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)", transform: hovered ? "translateY(-1px)" : "translateY(0)", display: "inline-block" }}>
      {label}
    </a>
  );
}

function SubscribeButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="submit" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--bg)", background: "var(--text)",
        border: "2px solid var(--text)", padding: "0.85rem 1.25rem",
        cursor: "pointer", borderRadius: 0,
        transition: "color 180ms ease",
      }}>
      <span aria-hidden style={{ position: "absolute", inset: 0, background: "var(--accent)", transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center", transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)" }} />
      <span style={{ position: "relative", zIndex: 1 }}>Subscribe</span>
    </button>
  );
}

export default function ContactContent() {
  return (
    <>
      {/* ── Header ── */}
      <section style={{ padding: "5rem 1.5rem 4rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>Join Us</div>
          </FadeUp>
          <MaskHeadline lines={["SHOW UP", "FRIDAY"]} size="clamp(3rem, 8vw, 6.5rem)" as="h1" />
          <FadeUp delay={300}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1rem, 2vw, 1.2rem)", fontStyle: "italic", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "560px", marginTop: "2rem" }}>
              No reservation required. No preparation necessary. Just show up and our greeters will roll out the red carpet.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Details + Map ── */}
      <section style={{ padding: "5rem 1.5rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left — info */}
          <SlideIn from="left">
            <SectionHeader label="Meeting Details" />
            <div style={{ border: "2px solid var(--border)", marginBottom: "2rem" }}>
              {[
                { label: "Day",          value: "Every Friday" },
                { label: "Doors Open",   value: "6:30 AM" },
                { label: "Teaching",     value: "7:00 AM" },
                { label: "Ends",         value: "8:00 AM" },
                { label: "Season",       value: "Labor Day through Memorial Day" },
                { label: "Cost",         value: "Free — always" },
                { label: "RSVP",         value: "Not required" },
              ].map((item, i, arr) => (
                <InfoRow key={item.label} label={item.label} value={item.value} borderBottom={i < arr.length - 1} />
              ))}
            </div>

            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.75rem" }}>Location</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--text)", lineHeight: 1.65, marginBottom: "1rem" }}>
              Building 300<br />410 Rucker Road<br />Alpharetta, GA 30009
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Located behind Restoration Church. Our greeters will be ready to welcome you.
            </p>
            <FillButton href="https://maps.google.com/maps?q=410+Rucker+Road+Alpharetta+GA" scheme="dark" external>Get Directions</FillButton>
          </SlideIn>

          {/* Right — map + connect */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <MapEmbed />

            <SlideIn from="right" delay={150}>
              <div style={{ border: "2px solid var(--border)", padding: "2rem" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "1.25rem" }}>Stay Connected</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Sign up for the weekly email to get teaching recaps, upcoming topics, and announcements.
                </p>
                <form action="https://onethingformen.org/contact" method="GET" target="_blank" style={{ display: "flex", gap: "0", marginBottom: "1.5rem" }}>
                  <input type="email" name="email" placeholder="Your email address" required style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: "0.85rem", padding: "0.85rem 1rem", background: "transparent", border: "2px solid var(--border)", borderRight: "none", color: "var(--text)", outline: "none", borderRadius: 0 }} />
                  <SubscribeButton />
                </form>
                <div style={{ display: "flex", gap: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-light)" }}>
                  <SocialLink label="YouTube"   href="https://www.youtube.com/@OneThingforMen" />
                  <SocialLink label="Facebook"  href="https://facebook.com/onethingformen" />
                  <SocialLink label="Instagram" href="https://instagram.com/onethingformen" />
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* ── Zoom CTA ── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--bg-dark)" }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader label="Can't Make It In Person?" />
          <SlideIn from="left">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "var(--bg)", marginBottom: "1.25rem", lineHeight: 1.2 }}>Online groups available through Zoom.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(244,239,232,0.6)", lineHeight: 1.8, marginBottom: "2rem" }}>Wherever you are, you can be part of a group of men doing the same work. Reach out to learn more about our online small group options.</p>
            <FillButton href="https://onethingformen.org/contact" scheme="dark-on-light" external>Inquire About Zoom Groups</FillButton>
          </SlideIn>
        </div>
      </section>
    </>
  );
}
