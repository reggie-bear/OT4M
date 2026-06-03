"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SearchResult } from "@/lib/types";

const PLACEHOLDER_QUERIES = [
  "How do I lead my family well?",
  "What does accountability look like?",
  "How do I study the Bible on my own?",
  "I'm struggling with my faith...",
  "What does the Bible say about work?",
  "How do I forgive someone who hurt me?",
  "How can I be a better husband?",
  "What does it mean to walk with God?",
];

interface SearchBarProps {
  large?: boolean;
  autoFocus?: boolean;
  onResults?: (results: SearchResult | null) => void;
  onLoading?: (loading: boolean) => void;
}

export default function SearchBar({
  large = false,
  autoFocus = false,
  onResults,
  onLoading,
}: SearchBarProps) {
  const [query, setQuery]                 = useState("");
  const [placeholderIndex, setIdx]        = useState(0);
  const [placeholderVisible, setVisible]  = useState(true);
  const [focused, setFocused]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [btnHovered, setBtnHovered]       = useState(false);
  const [btnPressed, setBtnPressed]       = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle placeholder
  useEffect(() => {
    if (focused || query) return;
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % PLACEHOLDER_QUERIES.length); setVisible(true); }, 300);
    }, 3200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [focused, query]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    onLoading?.(true);
    onResults?.(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error();
      onResults?.(await res.json());
    } catch {
      onResults?.({ answer: "Something went wrong. Please try again.", videos: [], query: q });
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  }, [query, onResults, onLoading]);

  const fontSize   = large ? "1.05rem" : "0.9rem";
  const padding    = large ? "1.1rem 1.5rem" : "0.9rem 1.25rem";
  const bw         = large ? "3px" : "2.5px";
  const iconSize   = large ? 22 : 18;
  const btnWidth   = large ? "58px" : "48px";

  const hasQuery   = !!query.trim();
  const isIdle     = !focused && !query;

  // Button visual state
  const btnBg = loading
    ? "var(--text-muted)"
    : btnPressed
    ? "var(--accent-dark)"
    : btnHovered && hasQuery
    ? "var(--accent)"
    : "var(--text)";               // ← always dark, never grayed out

  const btnTransform = btnPressed
    ? "scale(0.93)"
    : btnHovered && hasQuery
    ? "translateY(-2px) scale(1.05)"
    : "scale(1)";

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full" role="search">

        {/* Outer focus ring — expands in from center on focus */}
        <div aria-hidden style={{
          position: "absolute",
          inset: large ? "-5px" : "-4px",
          border: `${bw} solid var(--accent)`,
          pointerEvents: "none",
          opacity: focused ? 1 : 0,
          transform: focused ? "scale(1)" : "scale(0.97)",
          transition: "opacity 220ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)",
        }} />

        {/* Animated placeholder */}
        {!query && !focused && (
          <div aria-hidden style={{
            position: "absolute",
            top: "50%",
            left: large ? "1.5rem" : "1.25rem",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-body)",
            fontSize,
            color: "var(--text-light)",
            pointerEvents: "none",
            opacity: placeholderVisible ? 1 : 0,
            transition: "opacity 300ms ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: `calc(100% - ${large ? "5rem" : "4rem"})`,
            textOverflow: "ellipsis",
            zIndex: 2,
          }}>
            {PLACEHOLDER_QUERIES[placeholderIndex]}
          </div>
        )}

        <div style={{ position: "relative" }}>

          {/* Idle light sweep — glides across the input every ~5s when nothing is happening */}
          {isIdle && (
            <div aria-hidden style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 0,
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "45%",
                background: "linear-gradient(90deg, transparent 0%, rgba(184,76,30,0.07) 50%, transparent 100%)",
                animation: "sweep 5s ease-in-out infinite",
              }} />
            </div>
          )}

          {/* Loading shimmer */}
          {loading && (
            <div aria-hidden style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent, rgba(184,76,30,0.1), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.1s linear infinite",
              pointerEvents: "none",
              zIndex: 2,
            }} />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus={autoFocus}
            aria-label="Search One Thing for Men teachings"
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontSize,
              padding,
              paddingRight: large ? "4.5rem" : "3.5rem",
              background: "transparent",
              border: `${bw} solid ${focused || loading ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 0,
              color: "var(--text)",
              outline: "none",
              transition: "border-color 220ms cubic-bezier(0.16,1,0.3,1)",
              caretColor: "var(--accent)",
              position: "relative",
              zIndex: 1,
            }}
            placeholder=""
            autoComplete="off"
            spellCheck="false"
          />

          {/* Submit button — always solid dark, never grayed */}
          <button
            type="submit"
            disabled={loading}
            aria-label="Search"
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => { setBtnHovered(false); setBtnPressed(false); }}
            onMouseDown={() => setBtnPressed(true)}
            onMouseUp={() => setBtnPressed(false)}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: btnWidth,
              background: btnBg,
              border: "none",
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 180ms ease, transform 160ms cubic-bezier(0.34,1.56,0.64,1)",
              color: "var(--bg)",
              transform: btnTransform,
              zIndex: 2,
              overflow: "hidden",
            }}
          >
            {loading ? (
              /* Spinning arc */
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "spin 0.65s linear infinite" }}>
                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
              </svg>
            ) : (
              /* Icon container — search ↔ arrow morphs on query */
              <div style={{ position: "relative", width: iconSize, height: iconSize }}>

                {/* Magnifying glass — visible when no query */}
                <svg
                  width={iconSize} height={iconSize} viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: hasQuery ? 0 : 1,
                    transform: hasQuery ? "scale(0.6) rotate(-15deg)" : "scale(1) rotate(0deg)",
                    transition: "opacity 220ms ease, transform 280ms cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                {/* Arrow — visible when query exists */}
                <svg
                  width={iconSize} height={iconSize} viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: hasQuery ? 1 : 0,
                    transform: hasQuery
                      ? btnHovered ? "translateX(2px) scale(1)" : "translateX(0) scale(1)"
                      : "translateX(-8px) scale(0.7)",
                    transition: "opacity 220ms ease, transform 280ms cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes sweep {
          0%   { left: -45%; opacity: 0; }
          8%   { opacity: 1; }
          42%  { left: 145%; opacity: 0; }
          100% { left: 145%; opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
