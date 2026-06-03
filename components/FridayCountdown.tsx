"use client";
import { useState, useEffect } from "react";

// ── Season helpers ─────────────────────────────────────────────────────────────
// OT4M meets Fridays, Labor Day through Memorial Day only.
// Labor Day  = first Monday of September
// Memorial Day = last Monday of May

function getLaborDay(year: number): Date {
  const sep1 = new Date(year, 8, 1); // Sep 1 local
  const dow = sep1.getDay(); // 0=Sun
  const toMonday = dow === 1 ? 0 : (8 - dow) % 7;
  return new Date(year, 8, 1 + toMonday);
}

function getMemorialDay(year: number): Date {
  const may31 = new Date(year, 4, 31); // May 31 local
  const dow = may31.getDay();
  const toMonday = dow === 1 ? 0 : (dow === 0 ? 6 : dow - 1);
  return new Date(year, 4, 31 - toMonday);
}

// Returns { targetMs, offSeason, resumeDate } so the UI can label appropriately
function getCountdownTarget(): { targetMs: number; offSeason: boolean; resumeDate: string } {
  const now = new Date();

  // Determine ET offset (EDT = UTC-4 Mar–Oct, EST = UTC-5 Nov–Feb)
  const utcMonth = now.getUTCMonth();
  const etOffset = (utcMonth >= 2 && utcMonth <= 10) ? 4 : 5;

  // Current ET moment as a local-style Date (for day-of-week / hour calcs)
  const etMs = now.getTime() - etOffset * 3600000;
  const etNow = new Date(etMs); // treat UTC fields as ET values

  const etYear = etNow.getUTCFullYear();
  const etMonth = etNow.getUTCMonth(); // 0-indexed
  const etDay = etNow.getUTCDate();
  const etHour = etNow.getUTCHours();

  // Season boundaries for the current calendar year
  const memorialDay = getMemorialDay(etYear);   // late May — END of spring season
  const laborDay    = getLaborDay(etYear);        // early Sep — START of fall season

  // Build a comparable date-only value for today in ET
  const todayET = new Date(etYear, etMonth, etDay);

  const offSeason = todayET > memorialDay && todayET < laborDay;

  if (offSeason) {
    // Count to first Friday on or after Labor Day of THIS year
    const ldDow = laborDay.getDay(); // 1 = Monday
    const daysToFriday = (5 - ldDow + 7) % 7; // 4 days Mon→Fri
    const firstFriday = new Date(laborDay);
    firstFriday.setDate(laborDay.getDate() + daysToFriday);
    firstFriday.setHours(7, 0, 0, 0); // 7am local = ET (we built it in local)

    // Convert to UTC
    const targetMs = firstFriday.getTime() + etOffset * 3600000;
    const resumeDate = firstFriday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return { targetMs, offSeason: true, resumeDate };
  }

  // In-season: count to next Friday 7am ET
  const dow = etNow.getUTCDay();
  const hour = etNow.getUTCHours();
  let days = (5 - dow + 7) % 7;
  if (days === 0 && hour >= 7) days = 7; // past 7am Friday → next week

  const targetET = new Date(etMs);
  targetET.setUTCDate(etNow.getUTCDate() + days);
  targetET.setUTCHours(7 + etOffset, 0, 0, 0);

  return { targetMs: targetET.getTime(), offSeason: false, resumeDate: "" };
}

// ── Countdown hook ─────────────────────────────────────────────────────────────
interface Tick { d: number; h: number; m: number; s: number; offSeason: boolean; resumeDate: string; }

export function useFridayCountdown(): Tick {
  const [tick, setTick] = useState<Tick>({ d: 0, h: 0, m: 0, s: 0, offSeason: false, resumeDate: "" });

  useEffect(() => {
    function compute() {
      const { targetMs, offSeason, resumeDate } = getCountdownTarget();
      const diff = Math.max(0, targetMs - Date.now());
      setTick({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        offSeason,
        resumeDate,
      });
    }
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, []);

  return tick;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

// ── Site 1 — dark charcoal / Bebas Neue / burnt orange ────────────────────────
export function CountdownDark() {
  const { d, h, m, s, offSeason, resumeDate } = useFridayCountdown();
  const units = [
    { value: d, label: "DAYS" },
    { value: h, label: "HRS" },
    { value: m, label: "MIN" },
    { value: s, label: "SEC" },
  ];

  return (
    <div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase",
        color: "var(--text-light)", marginBottom: "0.6rem",
      }}>
        {offSeason
          ? `Season resumes ${resumeDate} — first Friday in`
          : "Next Friday in"}
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
        {units.map(({ value, label }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "flex-end", gap: i < 3 ? "0.75rem" : 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                lineHeight: 1, color: "var(--accent)",
                letterSpacing: "0.02em", minWidth: "2.2ch",
              }}>
                {pad(value)}
              </div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "0.55rem", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--text-light)", marginTop: "0.2rem",
              }}>
                {label}
              </div>
            </div>
            {i < 3 && (
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--text-light)", opacity: 0.4,
                marginBottom: "1.4rem", lineHeight: 1,
              }}>:</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Site 2 — white / Playfair Display / olive green ───────────────────────────
export function CountdownLight() {
  const { d, h, m, s, offSeason, resumeDate } = useFridayCountdown();
  const units = [
    { value: d, label: "days" },
    { value: h, label: "hrs" },
    { value: m, label: "min" },
    { value: s, label: "sec" },
  ];

  return (
    <div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem",
      }}>
        {offSeason ? `Resumes ${resumeDate} —` : "Next Friday in"}
      </div>
      <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
        {units.map(({ value, label }, i) => (
          <div key={label} style={{
            textAlign: "center", padding: "0.6rem 1rem",
            borderLeft: i === 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
            borderRight: "1px solid rgba(255,255,255,0.15)",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800, lineHeight: 1,
              color: "var(--green)", letterSpacing: "-0.02em", minWidth: "2ch",
            }}>
              {pad(value)}
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", marginTop: "0.25rem",
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
