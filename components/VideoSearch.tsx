'use client'

import { useState, useCallback } from 'react'

type SearchResult = {
  video_id: string
  title: string
  thumbnail_url: string
  timestamp_start: number
  text: string
  similarity: number
  url: string
}

const TOPICS = [
  'Prayer',
  'Marriage',
  'Fatherhood',
  'Temptation',
  'Pride',
  'Accountability',
  "God's Will",
  'Forgiveness',
  'Fear',
  'The Gospel',
  'Leadership',
  'Identity in Christ',
]

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VideoSearch({ dark = false }: { dark?: boolean }) {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState<SearchResult[]>([])
  const [loading, setLoading]     = useState(false)
  const [searched, setSearched]   = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [activeTopic, setActive]  = useState<string | null>(null)

  const inputBg    = dark ? 'bg-[#f7f4ef]/10 border-[#f7f4ef]/20 text-[#f7f4ef] placeholder:text-[#f7f4ef]/30' : 'bg-white border-[#1a1a18]/20 text-[#1a1a18] placeholder:text-[#1a1a18]/30'
  const cardBorder = dark ? 'border-[#f7f4ef]/10 hover:border-[#f7f4ef]/30' : 'border-[#1a1a18]/10 hover:border-[#1a1a18]/30'
  const titleColor = dark ? 'text-[#f7f4ef]' : 'text-[#1a1a18]'
  const excerptColor = dark ? 'text-[#f7f4ef]/50' : 'text-[#1a1a18]/50'
  const emptyColor   = dark ? 'text-[#f7f4ef]/40' : 'text-[#1a1a18]/40'
  const labelColor   = dark ? 'text-[#f7f4ef]/30' : 'text-[#1a1a18]/30'
  const chipBase     = dark
    ? 'border-[#f7f4ef]/20 text-[#f7f4ef]/60 hover:border-[#f7f4ef]/50 hover:text-[#f7f4ef]'
    : 'border-[#1a1a18]/15 text-[#1a1a18]/50 hover:border-[#1a1a18]/40 hover:text-[#1a1a18]'
  const chipActive   = dark
    ? 'border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c]'
    : 'border-[#1a1a18] bg-[#1a1a18] text-[#f7f4ef]'

  async function runSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setError(null)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResults(data.results ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setActive(null)
    runSearch(query)
  }

  const handleTopic = useCallback((topic: string) => {
    if (activeTopic === topic) return
    setActive(topic)
    setQuery(topic)
    runSearch(topic)
  }, [activeTopic])

  return (
    <div className="w-full">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(null) }}
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

      {/* Topic chips */}
      <div className="mt-5">
        <p className={`text-[10px] tracking-[0.2em] uppercase mb-3 ${labelColor}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
          Browse by topic
        </p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => handleTopic(topic)}
              className={`px-3 py-1.5 border text-xs tracking-[0.08em] transition-all duration-150 ${
                activeTopic === topic ? chipActive : chipBase
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {error && (
        <p className="mt-8 text-sm text-red-400" style={{ fontFamily: 'system-ui, sans-serif' }}>
          Error: {error}
        </p>
      )}

      {searched && !loading && !error && results.length === 0 && (
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
