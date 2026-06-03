'use client'

import { useState } from 'react'

type SearchResult = {
  video_id: string
  title: string
  thumbnail_url: string
  timestamp_start: number
  text: string
  similarity: number
  url: string
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VideoSearch({ dark = false }: { dark?: boolean }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fg = dark ? 'text-[#f7f4ef]' : 'text-[#1a1a18]'
  const inputBg = dark ? 'bg-[#f7f4ef]/10 border-[#f7f4ef]/20 text-[#f7f4ef] placeholder:text-[#f7f4ef]/30' : 'bg-white border-[#1a1a18]/20 text-[#1a1a18] placeholder:text-[#1a1a18]/30'
  const cardBorder = dark ? 'border-[#f7f4ef]/10 hover:border-[#f7f4ef]/30' : 'border-[#1a1a18]/10 hover:border-[#1a1a18]/30'
  const titleColor = dark ? 'text-[#f7f4ef]' : 'text-[#1a1a18]'
  const excerptColor = dark ? 'text-[#f7f4ef]/50' : 'text-[#1a1a18]/50'
  const emptyColor = dark ? 'text-[#f7f4ef]/40' : 'text-[#1a1a18]/40'

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    setResults(data.results ?? [])
    setLoading(false)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Try "dealing with anger" or "being a better father"'
          className={`flex-1 px-4 py-3 border text-sm focus:outline-none focus:ring-1 focus:ring-white/30 ${inputBg}`}
          style={{ fontFamily: 'system-ui, sans-serif' }}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-[#c9a84c] text-[#1a1a18] text-xs tracking-[0.15em] uppercase font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p className={`mt-8 text-sm ${emptyColor}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
          No results found. Try different words.
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-8 space-y-3">
          {results.map((r, i) => (
            <li key={i}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex gap-4 p-4 border transition-colors ${cardBorder}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={r.thumbnail_url}
                    alt={r.title}
                    className="w-28 h-[4.5rem] object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {formatTime(r.timestamp_start)}
                  </span>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <p className={`text-sm font-medium truncate ${titleColor}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {r.title}
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed line-clamp-2 ${excerptColor}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {r.text}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
