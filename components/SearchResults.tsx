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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Skeleton answer */}
          <div style={{ height: "1rem", background: "var(--bg-surface)", borderRadius: 2, width: "75%", animation: "pulse 1.5s ease infinite" }} />
          <div style={{ height: "1rem", background: "var(--bg-surface)", borderRadius: 2, width: "90%", animation: "pulse 1.5s ease infinite 0.1s" }} />
          <div style={{ height: "1rem", background: "var(--bg-surface)", borderRadius: 2, width: "60%", animation: "pulse 1.5s ease infinite 0.2s" }} />
          <div style={{ height: "0.5rem" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ aspectRatio: "16/9", background: "var(--bg-surface)", animation: `pulse 1.5s ease infinite ${i * 0.1}s` }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ height: "0.9rem", background: "var(--bg-surface)", borderRadius: 2, width: "80%", animation: `pulse 1.5s ease infinite ${i * 0.1}s` }} />
                <div style={{ height: "0.9rem", background: "var(--bg-surface)", borderRadius: 2, width: "60%", animation: `pulse 1.5s ease infinite ${i * 0.15}s` }} />
              </div>
            </div>
          ))}
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
