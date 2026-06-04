"use client";

const TITHE_URL = "https://give.tithe.ly/?formId=f90beb90-5950-48d8-8db8-590f970489e3";

const WAYS = [
  {
    number: "01",
    title: "Online",
    body: "With just a few steps, you can make a one-time contribution or set up recurring giving. We securely process donations via Stripe — credit or debit card, bank transfer, Apple Pay, and Google Pay all accepted.",
    cta: true,
  },
  {
    number: "02",
    title: "In Person",
    body: "Though we never take up a collection, if you'd like to support One Thing for Men at one of our gatherings, simply look for the designated giving area near registration. Cash or check welcome.",
    cta: false,
  },
  {
    number: "03",
    title: "By Mail",
    body: "Make checks payable to One Thing Ministries and mail to:",
    address: "One Thing Ministries\n602 Foxhollow Lane\nAlpharetta, GA 30004",
    cta: false,
  },
];

export default function DonateContent() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background: "var(--bg-dark)",
          borderBottom: "2px solid var(--border)",
          padding: "clamp(4rem, 8vw, 7rem) 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/bible-bg.png')",
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.06, filter: "sepia(0.55) brightness(1.12) contrast(0.82)",
            pointerEvents: "none",
          }}
        />
        <div className="max-w-3xl mx-auto" style={{ position: "relative" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>
            Support the Mission
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 10vw, 9rem)", lineHeight: 0.88, letterSpacing: "0.01em", color: "#F4EFE8", marginBottom: "1.5rem" }}>
            GIVE
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)", fontWeight: 400, fontStyle: "italic", color: "rgba(244,239,232,0.6)", lineHeight: 1.35 }}>
            A Ministry Driven by Generosity
          </p>
        </div>
      </section>

      {/* ── MISSION COPY ── */}
      <section style={{ padding: "clamp(3.5rem, 7vw, 6rem) 1.5rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.05rem, 2vw, 1.3rem)", lineHeight: 1.75, color: "var(--text)", marginBottom: "1.75rem" }}>
            Our mission at One Thing Ministries is to spur men on to a closer walk with God. Every dollar given to One Thing for Men is poured right back into the ministry, with no one here taking a salary—this is a fully volunteer-driven organization.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)", lineHeight: 1.85, color: "var(--text-muted)", marginBottom: "1.75rem" }}>
            Your financial support provides the resources required to host weekly Bible gatherings where truth is shared and life-changing conversations are fostered. Because of your investment, lives are transforming, families are being strengthened, and communities are benefiting as men walk in step with God's word and His purpose for their lives.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)", lineHeight: 1.85, color: "var(--text-muted)" }}>
            Thank you for joining us in this ministry. Every gift, especially monthly support, makes a meaningful difference.
          </p>
        </div>
      </section>

      {/* ── WAYS TO GIVE ── */}
      <section style={{ padding: "clamp(3.5rem, 7vw, 6rem) 1.5rem", borderBottom: "2px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "3rem" }}>
            Ways to Give
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {WAYS.map((way, i) => (
              <div
                key={way.number}
                style={{
                  padding: "2.5rem 2rem",
                  border: "2px solid var(--border)",
                  marginLeft: i > 0 ? "-2px" : 0,
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", lineHeight: 1, color: "var(--border-light)", marginBottom: "1rem" }}>
                  {way.number}
                </div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>
                  {way.title}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: way.cta || way.address ? "1.75rem" : 0 }}>
                  {way.body}
                </p>
                {way.address && (
                  <address style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontStyle: "normal", color: "var(--text)", lineHeight: 1.75, whiteSpace: "pre-line", borderLeft: "3px solid var(--accent)", paddingLeft: "1rem" }}>
                    {way.address}
                  </address>
                )}
                {way.cta && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <a
                      href={TITHE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block", textAlign: "center",
                        fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: "var(--bg)", background: "var(--accent)",
                        padding: "0.85rem 1.5rem", textDecoration: "none",
                        transition: "opacity 180ms ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      Give Monthly
                    </a>
                    <a
                      href={TITHE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block", textAlign: "center",
                        fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: "var(--text)", background: "transparent",
                        border: "2px solid var(--border)",
                        padding: "0.85rem 1.5rem", textDecoration: "none",
                        transition: "background 180ms ease, color 180ms ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}
                    >
                      Donate Once
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 501c3 ── */}
      <section style={{ padding: "clamp(2.5rem, 5vw, 4rem) 1.5rem" }}>
        <div className="max-w-3xl mx-auto" style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
          <div style={{ width: "3px", flexShrink: 0, alignSelf: "stretch", background: "var(--border-light)" }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-light)", lineHeight: 1.8 }}>
            One Thing for Men is a non-profit program operating under the 501(c)(3) umbrella of{" "}
            <strong style={{ color: "var(--text-muted)", fontWeight: 600 }}>One Thing Ministries, Inc.</strong>{" "}
            No one here takes a salary. We are a fully volunteer-driven organization. Your gift is tax-deductible to the extent permitted by law.
          </p>
        </div>
      </section>
    </>
  );
}
