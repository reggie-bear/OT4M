"use client";

import { SearchResult } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

interface Props {
  result: SearchResult | null;
  loading: boolean;
}

function VideoCard({
  video,
  index,
}: {
  video: SearchResult["videos"][0];
  index: number;
}) {
  const watchUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
  const date = new Date(video.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        animation: `fadeSlideIn 500ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        animationDelay: `${index * 90}ms`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: "1rem",
          borderBottom: `1px solid ${hovered ? "var(--accent)" : "var(--border-light)"}`,
          borderLeft: `3px solid ${hovered ? "var(--accent)" : "transparent"}`,
          paddingBottom: "1.25rem",
          paddingLeft: hovered ? "0.75rem" : "0",
          marginBottom: "1.25rem",
          transition: "border-color 200ms ease, padding-left 200ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16/9",
            background: "var(--bg-surface)",
            border: "2px solid var(--border-light)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
          {/* Play overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(26,21,16,0.35)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--bg)">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text)",
              lineHeight: 1.35,
              marginBottom: "0.4rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {video.title}
          </div>
          {video.snippet && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "0.4rem",
              }}
            >
              {video.snippet}
            </p>
          )}
          <div
            style={{
              fontSize: "0.68rem",
              color: "var(--text-light)",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            {date}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </a>
  );
}

export default function SearchResults({ result, loading }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  if (!loading && !result) return null;

  return (
    <div
      ref={ref}
      style={{
        marginTop: "2rem",
        borderTop: "2px solid var(--border)",
        paddingTop: "2rem",
        animation: "fadeIn 300ms ease both",
      }}
    >
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2.5rem 0 1.5rem", gap: "1.75rem" }}>

          {/* Bible flipping pages SVG */}
          <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            {/* Book spine */}
            <rect x="34" y="6" width="4" height="44" fill="var(--accent)" rx="1" />
            {/* Left cover */}
            <path d="M34 8 C20 8 6 12 4 16 L4 48 C6 44 20 42 34 42 Z" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1.5" />
            {/* Right cover */}
            <path d="M38 8 C52 8 66 12 68 16 L68 48 C66 44 52 42 38 42 Z" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1.5" />
            {/* Left text lines */}
            <line x1="10" y1="20" x2="30" y2="18" stroke="var(--border-light)" strokeWidth="1" />
            <line x1="10" y1="25" x2="30" y2="23" stroke="var(--border-light)" strokeWidth="1" />
            <line x1="10" y1="30" x2="30" y2="28" stroke="var(--border-light)" strokeWidth="1" />
            <line x1="10" y1="35" x2="30" y2="33" stroke="var(--border-light)" strokeWidth="1" />
            {/* Right text lines */}
            <line x1="42" y1="18" x2="62" y2="20" stroke="var(--border-light)" strokeWidth="1" />
            <line x1="42" y1="23" x2="62" y2="25" stroke="var(--border-light)" strokeWidth="1" />
            <line x1="42" y1="28" x2="62" y2="30" stroke="var(--border-light)" strokeWidth="1" />
            <line x1="42" y1="33" x2="62" y2="35" stroke="var(--border-light)" strokeWidth="1" />
            {/* Flipping page 1 */}
            <path style={{ animation: "flip1 2.4s ease-in-out infinite", transformOrigin: "36px 25px" }}
              d="M36 8 C40 10 52 12 60 16 L58 44 C50 40 40 40 36 42 Z"
              fill="var(--bg)" stroke="var(--border-light)" strokeWidth="1" opacity="0.9"
            />
            {/* Flipping page 2 */}
            <path style={{ animation: "flip2 2.4s ease-in-out 0.3s infinite", transformOrigin: "36px 25px" }}
              d="M36 8 C40 10 50 13 57 17 L55 44 C48 41 40 40 36 42 Z"
              fill="var(--bg-surface)" stroke="var(--border-light)" strokeWidth="1" opacity="0.85"
            />
          </svg>

          {/* Animated loading text */}
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              animation: "breathe 2.4s ease-in-out infinite",
              letterSpacing: "0.01em",
              lineHeight: 1.6,
            }}>
              Searching through the scriptures
              <br />
              and OT4M teachings…
            </p>
          </div>

          <style>{`
            @keyframes flip1 {
              0%, 100% { transform: rotateY(0deg) skewY(0deg); opacity: 0.9; }
              40%       { transform: rotateY(-55deg) skewY(-4deg); opacity: 0.4; }
              60%       { transform: rotateY(-55deg) skewY(-4deg); opacity: 0.4; }
            }
            @keyframes flip2 {
              0%, 100% { transform: rotateY(0deg) skewY(0deg); opacity: 0.85; }
              40%       { transform: rotateY(-40deg) skewY(-3deg); opacity: 0.3; }
              60%       { transform: rotateY(-40deg) skewY(-3deg); opacity: 0.3; }
            }
            @keyframes breathe {
              0%, 100% { opacity: 0.5; }
              50%       { opacity: 1; }
            }
          `}</style>
        </div>
      ) : result ? (
        <>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            One Thing Answer
          </div>

          {/* AI Answer */}
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "var(--text)",
              marginBottom: "1.75rem",
              paddingLeft: "1.25rem",
              borderLeft: "3px solid var(--accent)",
              animation: "answerReveal 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            {result.answer}
          </div>

          {/* Videos */}
          {result.videos.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "1.25rem",
                }}
              >
                Related Teachings · {result.videos.length} videos
              </div>
              {result.videos.map((v, i) => (
                <VideoCard key={v.videoId} video={v} index={i} />
              ))}
            </>
          )}
        </>
      ) : null}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes answerReveal {
          from { opacity: 0; transform: translateY(12px); border-left-color: transparent; }
          to   { opacity: 1; transform: translateY(0);    border-left-color: var(--accent); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
