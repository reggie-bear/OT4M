import type { Metadata } from "next";
import MessagesSearch from "@/components/MessagesSearch";
import VideoCard from "@/components/VideoCard";
import AnimateIn from "@/components/AnimateIn";
import SectionHeader from "@/components/SectionHeader";
import FillButton from "@/components/FillButton";
import MaskHeadline from "@/components/MaskHeadline";
import { getLatestVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Messages — One Thing for Men",
  description:
    "15+ years of biblical teaching for men. Search our message archive or browse the latest teachings from One Thing for Men in Alpharetta, GA.",
};

export default async function Messages() {
  const videos = await getLatestVideos(6);

  return (
    <>
      {/* ── Page header + search ── */}
      <section style={{ padding: "5rem 1.5rem 4rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>
              Messages
            </div>
          </AnimateIn>

          <MaskHeadline lines={["15+ YEARS", "OF TEACHING"]} size="clamp(3rem, 8vw, 6.5rem)" as="h1" />

          <AnimateIn delay={280}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1rem, 2vw, 1.2rem)", fontStyle: "italic", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: "560px", marginTop: "1.75rem" }}>
              Ask a question and our AI finds the exact teaching you need — or search by topic below.
            </p>
          </AnimateIn>

          <AnimateIn delay={380}>
            <MessagesSearch />
          </AnimateIn>
        </div>
      </section>

      {/* ── Latest 6 videos ── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          borderBottom: "2px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <SectionHeader label="Latest Teachings" />

          {/* Video grid */}
          {videos.length > 0 ? (
            <>
              {/*
                Grid border trick: outer container has border-left + border-top.
                Each cell has border-right + border-bottom.
                Result: perfect internal borders at every breakpoint with no gaps or doubles.
              */}
              <div
                style={{
                  borderLeft: "2px solid var(--border)",
                  borderTop: "2px solid var(--border)",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video, i) => (
                    <div
                      key={video.videoId}
                      style={{
                        borderRight: "2px solid var(--border)",
                        borderBottom: "2px solid var(--border)",
                      }}
                    >
                      <VideoCard video={video} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Fallback if RSS fails */
            <div
              style={{
                border: "2px solid var(--border)",
                padding: "3rem 2rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Unable to load latest videos right now.
              </p>
              <a
                href="https://www.youtube.com/@OneThingforMen"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--bg)",
                  background: "var(--text)",
                  padding: "0.7rem 1.5rem",
                  textDecoration: "none",
                }}
              >
                Watch on YouTube
              </a>
            </div>
          )}

          {/* Archive CTA */}
          <AnimateIn delay={200}>
            <div style={{ marginTop: "3rem", padding: "2rem", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", background: "var(--bg-surface)" }}>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.3rem" }}>300+ messages in the archive</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>Every Friday morning session since 2009, organized by series on YouTube.</p>
              </div>
              <FillButton href="https://www.youtube.com/@OneThingforMen" scheme="dark" external>Browse Full Archive</FillButton>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
