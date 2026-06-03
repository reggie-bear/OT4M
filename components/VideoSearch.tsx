'use client'

import { useState, useRef } from 'react'

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

export default function VideoSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search messages… e.g. "dealing with anger" or "being a better father""
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p className="mt-6 text-center text-gray-500">No results found. Try different words.</p>
      )}

      {results.length > 0 && (
        <ul className="mt-6 space-y-4">
          {results.map((r, i) => (
            <li key={i}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={r.thumbnail_url}
                    alt={r.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                    {formatTime(r.timestamp_start)}
                  </span>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{r.title}</p>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{r.text}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
