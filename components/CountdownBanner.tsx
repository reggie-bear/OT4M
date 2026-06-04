"use client";

import { useState, useEffect } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** First Monday of September */
function getLaborDay(year: number): Date {
  const sep1 = new Date(year, 8, 1);
  const dow = sep1.getDay(); // 0=Sun, 1=Mon …
  return new Date(year, 8, 1 + (dow === 1 ? 0 : (8 - dow) % 7));
}

/** Last Monday of May */
function getMemorialDay(year: number): Date {
  const may31 = new Date(year, 4, 31);
  const dow = may31.getDay();
  return new Date(year, 4, 31 - ((dow + 6) % 7));
}

/** True if the given calendar date falls within the ministry season */
function isInSeason(d: Date): boolean {
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-indexed
  if (m >= 5 && m <= 7) return false;             // Jun–Aug → always off
  if (m >= 8)           return d >= getLaborDay(y); // Sep–Dec → after Labor Day
  return d <= getMemorialDay(y);                   // Jan–May → before Memorial Day
}

/** ET time-parts from a UTC Date object */
function getETparts(utc: Date) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year:   "numeric",
    month:  "numeric",
    day:    "numeric",
    hour:   "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  const parts = Object.fromEntries(f.formatToParts(utc).map(p => [p.type, p.value]));
  return {
    year:    parseInt(parts.year),
    month:   parseInt(parts.month) - 1,       // 0-indexed
    day:     parseInt(parts.day),
    hour:    parseInt(parts.hour) % 24,        // guard against "24" for midnight
    minute:  parseInt(parts.minute),
    second:  parseInt(parts.second),
    weekday: new Date(parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day)).getDay(),
  };
}

/**
 * Return the UTC timestamp that corresponds to 7:00 AM Eastern on a given
 * calendar date, honouring DST automatically via Intl.
 */
function meeting7amUTC(year: number, month: number, day: number): Date {
  // Probe: what ET hour is it when it's noon UTC on that day?
  const probeUTC = new Date(Date.UTC(year, month, day, 12, 0, 0));
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false,
  });
  const etHourAtNoonUTC = parseInt(f.format(probeUTC)) % 24;
  // offset: e.g. ET=7 when UTC=12  →  offsetHrs = 7 - 12 = -5 (EST)
  //         ET=8 when UTC=12  →  offsetHrs = 8 - 12 = -4 (EDT)
  const offsetHrs = etHourAtNoonUTC - 12;
  return new Date(Date.UTC(year, month, day, 7 - offsetHrs, 0, 0));
}

// ── State machine ─────────────────────────────────────────────────────────────

type BannerState =
  | { kind: "now" }
  | { kind: "countdown"; target: Date; daysOut: number }
  | { kind: "offseason"; nextStart: Date };

function computeState(now: Date): BannerState {
  const et = getETparts(now);
  const calDate = new Date(et.year, et.month, et.day);

  // ① Is a meeting happening right now? (Friday in-season, 7:00–8:00 ET)
  if (et.weekday === 5 && isInSeason(calDate) && et.hour >= 7 && et.hour < 8) {
    return { kind: "now" };
  }

  // ② Find the next in-season Friday (search up to 30 days out)
  for (let i = 0; i < 30; i++) {
    const candidate = new Date(et.year, et.month, et.day + i);
    if (candidate.getDay() !== 5) continue;
    if (!isInSeason(candidate)) continue;

    const target = meeting7amUTC(
      candidate.getFullYear(),
      candidate.getMonth(),
      candidate.getDate()
    );

    // Skip if that 7 AM has already passed
    if (target <= now) continue;

    return { kind: "countdown", target, daysOut: i };
  }

  // ③ Off-season — show first Friday on or after Labor Day
  const labourThisYear = getLaborDay(et.year);
  const labourBase = now < labourThisYear ? labourThisYear : getLaborDay(et.year + 1);
  const daysToFriday = (5 - labourBase.getDay() + 7) % 7; // Labor Day is Mon → always 4
  const firstFriday = new Date(labourBase);
  firstFriday.setDate(labourBase.getDate() + daysToFriday);
  return { kind: "offseason", nextStart: firstFriday };
}

function timeDiff(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms % 86_400_000) / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1_000),
  };
}

function fmt2(n: number) { return String(n).padStart(2, "0"); }

// ── Sub-components ────────────────────────────────────────────────────────────

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "2.2ch" }}>
      <span
        key={value}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          lineHeight: 1,
          color: "var(--accent)",
          letterSpacing: "0.04em",
          animation: "tick 180ms ease both",
        }}
      >
        {fmt2(value)}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(244,239,232,0.6)",
          marginTop: "1px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "2.2rem",
        color: "rgba(244,239,232,0.5)",
        lineHeight: 1,
        marginBottom: "0.7rem",
        userSelect: "none",
      }}
    >
      :
    </span>
  );
}

// ── Main banner ───────────────────────────────────────────────────────────────

export default function CountdownBanner() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<BannerState | null>(null);
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true);

    function tick() {
      const now = new Date();
      const s = computeState(now);
      setState(s);
      if (s.kind === "countdown") setDiff(timeDiff(s.target, now));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Reserve height to prevent layout shift; content renders after mount
  if (!mounted || !state) {
    return (
      <div
        style={{
          height: "84px",
          background: "var(--bg-dark)",
          borderBottom: "1px solid rgba(244,239,232,0.08)",
        }}
      />
    );
  }

  // ── Now ──
  if (state.kind === "now") {
    return (
      <div
        style={{
          height: "84px",
          background: "var(--bg-dark)",
          borderBottom: "1px solid rgba(244,239,232,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        {/* Pulsing dot */}
        <span
          style={{
            display: "inline-block",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "var(--accent)",
            animation: "liveGlow 1.4s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.3rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Happening Now
        </span>
        <span
          style={{
            width: "2px",
            height: "28px",
            background: "rgba(244,239,232,0.3)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.2rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(244,239,232,0.8)",
          }}
        >
          Every Friday 7–8 AM · 410 Rucker Rd, Alpharetta
        </span>
        <style>{`
          @keyframes liveGlow {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(184,76,30,0.6); }
            50%       { opacity: 0.7; box-shadow: 0 0 0 5px rgba(184,76,30,0); }
          }
        `}</style>
      </div>
    );
  }

  // ── Off-season ──
  if (state.kind === "offseason") {
    const label = state.nextStart.toLocaleDateString("en-US", {
      weekday: "long",
      month:   "long",
      day:     "numeric",
      year:    "numeric",
      timeZone: "America/New_York",
    });
    return (
      <div
        style={{
          height: "84px",
          background: "var(--bg-dark)",
          borderBottom: "1px solid rgba(244,239,232,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.2rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(244,239,232,0.75)",
          }}
        >
          Season Resumes
        </span>
        <span
          style={{
            width: "2px",
            height: "28px",
            background: "rgba(244,239,232,0.3)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.3rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "var(--accent)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: "2px",
            height: "28px",
            background: "rgba(244,239,232,0.3)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.2rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(244,239,232,0.7)",
          }}
        >
          Doors 6:30 AM · 410 Rucker Rd, Alpharetta
        </span>
      </div>
    );
  }

  // ── Countdown ──
  const isToday = state.daysOut === 0;
  return (
    <div
      style={{
        height: "84px",
        background: "var(--bg-dark)",
        borderBottom: "1px solid rgba(244,239,232,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(0.5rem, 2vw, 1.5rem)",
        padding: "0 1rem",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <span
        className="hidden sm:block"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.2rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(244,239,232,0.75)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {isToday ? "Today's meeting in" : "Next meeting in"}
      </span>

      <span
        className="block sm:hidden"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.1rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(244,239,232,0.75)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Next meeting
      </span>

      {/* Divider */}
      <span style={{ width: "2px", height: "28px", background: "rgba(244,239,232,0.25)", flexShrink: 0 }} />

      {/* Clock units */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(0.3rem, 1vw, 0.75rem)" }}>
        {diff.d > 0 && (
          <>
            <Unit value={diff.d} label="days" />
            <Sep />
          </>
        )}
        <Unit value={diff.h} label="hrs" />
        <Sep />
        <Unit value={diff.m} label="min" />
        <Sep />
        <Unit value={diff.s} label="sec" />
      </div>

      {/* Divider */}
      <span
        className="hidden md:block"
        style={{ width: "2px", height: "28px", background: "rgba(244,239,232,0.25)", flexShrink: 0 }}
      />

      {/* Context */}
      <span
        className="hidden md:block"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.2rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(244,239,232,0.65)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Every Friday · 7 AM · Alpharetta, GA
      </span>
    </div>
  );
}
