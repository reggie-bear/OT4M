"use client";

import { useState } from "react";
import { YTVideo } from "@/lib/youtube";

interface VideoCardProps {
  video: YTVideo;
  index: number;
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const date = new Date(video.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Fall back to hqdefault if mqdefault 404s
  const thumb = imgError
    ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
    : video.thumbnailUrl;

  return (
    <a
      href={video.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        border: "2px solid var(--border)",
        borderLeft: `4px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        background: hovered ? "rgba(184,76,30,0.025)" : "transparent",
        transition:
          "border-left-color 200ms ease, background 200ms ease, transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(26,21,16,0.1)" : "none",
        animation: `cardIn 500ms cubic-bezier(0.16,1,0.3,1) ${index * 70}ms both`,
        cursor: "pointer",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          overflow: "hidden",
          background: "var(--bg-surface)",
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={video.title}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
          loading="lazy"
        />

        {/* Play button overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(26,21,16,0.4)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: hovered ? "scale(1)" : "scale(0.8)",
              transition: "transform 250ms cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="var(--bg)"
              style={{ marginLeft: "2px" }}
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem 1.25rem 1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Teaching
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: "var(--text-light)",
            }}
          >
            {date}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "var(--text)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: 0,
          }}
        >
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              margin: 0,
              flex: 1,
            }}
          >
            {video.description}
          </p>
        )}

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: hovered ? "var(--accent)" : "var(--text-muted)",
            transition: "color 180ms ease",
            marginTop: "0.25rem",
          }}
        >
          Watch Message
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)",
              transform: hovered ? "translateX(3px)" : "translateX(0)",
            }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </a>
  );
}
