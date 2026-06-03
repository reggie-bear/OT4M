"use client";
import { useState, useEffect } from "react";

function getNextFriday7amUTC(): number {
  const now = new Date();
  const month = now.getUTCMonth(); // 0-11
  // EDT: March–October (UTC-4), EST: Nov–Feb (UTC-5)
  const etOffset = (month >= 2 && month <= 10) ? 4 : 5;
  // Current moment shifted to ET
  const etMs = now.getTime() - etOffset * 3600000;
  const etNow = new Date(etMs);
  const dow = etNow.getUTCDay(); // 0=Sun, 5=Fri
  const hour = etNow.getUTCHours();
  let days = (5 - dow + 7) % 7;
  if (days === 0 && hour >= 7) days = 7; // past 7am Friday → next week
  const target = new Date(etMs);
  target.setUTCDate(etNow.getUTCDate() + days);
  target.setUTCHours(7 + etOffset, 0, 0, 0); // 7am ET in UTC
  return target.getTime();
}

interface Time { d: number; h: number; m: number; s: number; }

export function useFridayCountdown(): Time {
  const [time, setTime] = useState<Time>({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    function tick() {
      const diff = Math.max(0, getNextFriday7amUTC() - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

// Site 1 — dark charcoal / Bebas Neue / burnt orange
export function CountdownDark() {
  const { d, h, m, s } = useFridayCountdown();
  const units = [
    { value: d, label: "DAYS" },
    { value: h, label: "HRS" },
    { value: m, label: "MIN" },
    { value: s, label: "SEC" },
  ];
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
      {units.map(({ value, label }, i) => (
        <div key={label} style={{ display: "flex", alignItems: "flex-end", gap: i < 3 ? "0.75rem" : 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7vw, 5rem)",
              lineHeight: 1, color: "var(--accent)", letterSpacing: "0.02em",
              minWidth: "2.2ch", tabularNums: true,
            } as any}>
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
          {i < 3 && <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--text-light)", opacity: 0.4, marginBottom: "1.4rem", lineHeight: 1 }}>:</div>}
        </div>
      ))}
    </div>
  );
}

// Site 2 — white / Playfair Display / olive green
export function CountdownLight() {
  const { d, h, m, s } = useFridayCountdown();
  const units = [
    { value: d, label: "days" },
    { value: h, label: "hrs" },
    { value: m, label: "min" },
    { value: s, label: "sec" },
  ];
  return (
    <div style={{ display: "flex", gap: "0", alignItems: "stretch" }}>
      {units.map(({ value, label }, i) => (
        <div key={label} style={{ display: "flex", alignItems: "stretch" }}>
          <div style={{ textAlign: "center", padding: "0.6rem 1rem", borderLeft: i === 0 ? "1px solid var(--border)" : "none", borderRight: "1px solid var(--border)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800, lineHeight: 1, color: "var(--green)",
              letterSpacing: "-0.02em", minWidth: "2ch",
            }}>
              {pad(value)}
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--text-light)", marginTop: "0.25rem",
            }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
