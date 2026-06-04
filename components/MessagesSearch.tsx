"use client";

import { useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { SearchResult } from "@/lib/types";

const TOPICS = [
  "Prayer",
  "Marriage",
  "Fatherhood",
  "Temptation",
  "Pride",
  "Accountability",
  "God's Will",
  "Forgiveness",
  "Fear",
  "The Gospel",
  "Leadership",
  "Identity in Christ",
];

export default function MessagesSearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const searchTopic = useCallback(async (topic: string) => {
    setActiveTopic(topic);
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: topic }),
      });
      setResults(await res.json());
    } catch {
      setResults({ answer: "Something went wrong. Please try again.", videos: [], query: topic });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResults = (r: SearchResult | null) => {
    setResults(r);
    if (!r) setActiveTopic(null);
  };

  return (
    <>
      {/* Search bar */}
      <SearchBar
        large
        onResults={handleResults}
        onLoading={setLoading}
      />

      {/* Topic chips */}
      <div style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-light)",
            marginBottom: "0.85rem",
          }}
        >
          Browse by topic
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {TOPICS.map((topic) => {
            const active = activeTopic === topic;
            return (
              <TopicChip
                key={topic}
                label={topic}
                active={active}
                onClick={() => active ? null : searchTopic(topic)}
              />
            );
          })}
        </div>
      </div>

      <SearchResults result={results} loading={loading} />
    </>
  );
}

function TopicChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.06em",
        color: active ? "var(--bg)" : hovered ? "var(--bg)" : "var(--text)",
        background: active ? "var(--accent)" : hovered ? "var(--text)" : "transparent",
        border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
        padding: "0.4rem 0.9rem",
        cursor: "pointer",
        transition: "background 180ms ease, color 180ms ease, border-color 180ms ease",
        borderRadius: 0,
      }}
    >
      {label}
    </button>
  );
}
