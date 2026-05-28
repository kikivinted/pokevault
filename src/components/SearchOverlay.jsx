import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'

const BASE_URL = 'https://api.pokemontcg.io/v2'

function getPrice(card) {
  return card.cardmarket?.prices?.averageSellPrice
    || card.tcgplayer?.prices?.holofoil?.market
    || card.tcgplayer?.prices?.normal?.market
    || null
}

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const { dispatch, isInCollection } = useCollection()

  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }

    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const t = setTimeout(() => {
      setLoading(true)
      fetch(`${BASE_URL}/cards?q=name:${encodeURIComponent(query)}*&pageSize=8&orderBy=-set.releaseDate`, { signal: ctrl.signal })
        .then(r => r.json())
        .then(d => { setResults(d.data || []); setLoading(false) })
        .catch(e => { if (e.name !== 'AbortError') setLoading(false) })
    }, 300)

    return () => { clearTimeout(t); ctrl.abort() }
  }, [query])

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-poke-dark border-b border-poke-border p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-poke-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher une carte Pokémon..."
              className="w-full bg-poke-card border border-poke-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-poke-muted focus:outline-none focus:border-poke-yellow transition-colors"
            />
          </div>
          <button
            onClick={onClose}
            className="px-4 py-3 text-poke-muted hover:text-white transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-poke-border border-t-poke-yellow rounded-full animate-spin"/>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {results.map(card => {
                const price = getPrice(card)
                const owned = isInCollection(card.id)
                return (
                  <Link
                    key={card.id}
                    to={`/carte/${card.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-poke-card border border-transparent hover:border-poke-border transition-all group"
                  >
                    <img
                      src={card.images?.small}
                      alt={card.name}
                      className="h-14 w-10 object-contain rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold group-hover:text-poke-yellow transition-colors">{card.name}</span>
                        {owned && <span className="text-xs bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded-full">Possédée</span>}
                      </div>
                      <p className="text-sm text-poke-muted truncate">{card.set?.name} · {card.rarity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-poke-yellow text-sm">
                        {price ? `${price.toFixed(2)} €` : '—'}
                      </div>
                      {!owned && (
                        <button
                          onClick={e => { e.preventDefault(); dispatch({ type: 'ADD_CARD', card }) }}
                          className="text-xs text-poke-muted hover:text-poke-yellow transition-colors mt-0.5"
                        >
                          + Ajouter
                        </button>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 text-poke-muted">
              Aucune carte trouvée pour « {query} »
            </div>
          )}

          {!query && (
            <div className="text-center py-12 text-poke-muted">
              <div className="text-4xl mb-3">🔍</div>
              <p>Tapez le nom d'une carte pour rechercher</p>
              <p className="text-sm mt-1">Ex: Charizard, Pikachu, Mewtwo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
