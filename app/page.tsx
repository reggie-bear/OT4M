import VideoSearch from '@/components/VideoSearch'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1a1a18]" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1a1a18]/10">
        <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>
          One Thing for Men
        </span>
        <a
          href="https://www.youtube.com/@OneThingforMen"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.15em] uppercase border border-[#1a1a18]/30 px-4 py-2 hover:bg-[#1a1a18] hover:text-[#f7f4ef] transition-colors"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          Watch on YouTube
        </a>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-20 pb-16 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase mb-6 text-[#1a1a18]/50" style={{ fontFamily: 'system-ui, sans-serif' }}>
          Alpharetta, GA &nbsp;·&nbsp; Fridays 7–8am
        </p>
        <h1 className="text-6xl md:text-8xl font-normal leading-[0.95] mb-8 tracking-tight">
          One Thing<br />for Men
        </h1>
        <p className="text-lg md:text-xl text-[#1a1a18]/60 max-w-xl leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
          Weekly non-denominational Bible study for men who want to go deeper —
          as husbands, fathers, and leaders.
        </p>
      </section>

      {/* Search */}
      <section className="px-8 py-16 bg-[#1a1a18] text-[#f7f4ef]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase mb-4 text-[#f7f4ef]/40" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Message Archive
          </p>
          <h2 className="text-3xl md:text-4xl font-normal mb-3">
            Search 400+ messages
          </h2>
          <p className="text-[#f7f4ef]/50 mb-10 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Type any topic, scripture, or question. Find the exact moment in any talk.
          </p>
          <VideoSearch dark />
        </div>
      </section>

      {/* About */}
      <section className="px-8 py-20 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-6 text-[#1a1a18]/40" style={{ fontFamily: 'system-ui, sans-serif' }}>
            About
          </p>
          <h2 className="text-3xl md:text-4xl font-normal mb-6 leading-tight">
            A room full of men<br />getting real with God.
          </h2>
          <p className="text-[#1a1a18]/60 leading-relaxed mb-4" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
            Every Friday morning, men from all walks of life and all denominations gather at
            Restoration Church in Alpharetta. One short message anchored in scripture.
            Table discussions that bring it home — to your marriage, your family, your work.
          </p>
          <p className="text-[#1a1a18]/60 leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
            No pressure. No program. Just men showing up for each other and for God.
          </p>
        </div>
        <div className="space-y-px">
          {[
            ['When', 'Fridays, Labor Day through Memorial Day'],
            ['Doors', '6:30 AM'],
            ['Message', '7:00 – 8:00 AM'],
            ['Where', 'Restoration Church\n410 Rucker Road\nAlpharetta, GA'],
            ['Cost', 'Free'],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-8 py-5 border-b border-[#1a1a18]/10">
              <span className="text-xs tracking-[0.15em] uppercase text-[#1a1a18]/40 w-16 pt-0.5 flex-shrink-0" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {label}
              </span>
              <span className="text-sm text-[#1a1a18]/80 leading-relaxed whitespace-pre-line" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 border-t border-[#1a1a18]/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-normal mb-2">Join us Friday morning.</h2>
            <p className="text-[#1a1a18]/50 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
              No registration. Just show up.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://maps.google.com/?q=410+Rucker+Road+Alpharetta+GA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.15em] uppercase border border-[#1a1a18] px-6 py-3 hover:bg-[#1a1a18] hover:text-[#f7f4ef] transition-colors"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Get Directions
            </a>
            <a
              href="https://www.youtube.com/@OneThingforMen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.15em] uppercase bg-[#1a1a18] text-[#f7f4ef] px-6 py-3 hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Watch Messages
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-[#1a1a18]/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-[#1a1a18]/30" style={{ fontFamily: 'system-ui, sans-serif' }}>
            © One Thing for Men · Alpharetta, GA
          </span>
          <a
            href="https://www.youtube.com/@OneThingforMen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#1a1a18]/30 hover:text-[#1a1a18] transition-colors"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            youtube.com/@OneThingforMen
          </a>
        </div>
      </footer>

    </main>
  )
}
