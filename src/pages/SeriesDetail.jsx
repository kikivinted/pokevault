import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSets } from '../hooks/usePokemonAPI'
import PokemonCard from '../components/PokemonCard'
import { Spinner } from '../components/LoadingGrid'
import { CardSkeleton } from '../components/LoadingGrid'

const BASE_URL = 'https://api.pokemontcg.io/v2'

const RARITY_ORDER = [
  'Common', 'Uncommon', 'Rare', 'Rare Holo',
  'Rare Holo EX', 'Rare Holo GX', 'Rare Holo V', 'Rare Holo VMAX', 'Rare Holo VSTAR',
  'Rare Ultra', 'Rare Rainbow', 'Rare Secret', 'Amazing Rare',
  'Radiant Rare', 'Double Rare', 'Illustration Rare',
  'Special Illustration Rare', 'Hyper Rare', 'ACE SPEC Rare',
  'Promo',
]

export default function SeriesDetail() {
  const { setId } = useParams()
  const { sets } = useSets()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [rarityFilter, setRarityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const set = sets.find(s => s.id === setId)

  useEffect(() => {
    setLoading(true)
    setCards([])
    setPage(1)
  }, [setId])

  useEffect(() => {
    if (!setId) return
    setLoading(true)

    const rarityQ = rarityFilter ? ` rarity:"${rarityFilter}"` : ''
    const url = `${BASE_URL}/cards?q=set.id:${setId}${rarityQ}&pageSize=30&page=${page}&orderBy=number`

    fetch(url)
      .then(r => r.json())
      .then(d => {
        setCards(d.data || [])
        setTotal(d.totalCount || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [setId, rarityFilter, page])

  const rarities = useMemo(() => {
    if (!set) return []
    return RARITY_ORDER
  }, [set])

  const totalPages = Math.ceil(total / 30)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-poke-muted mb-6">
          <Link to="/series" className="hover:text-poke-yellow transition-colors">Séries</Link>
          <span>›</span>
          <span className="text-white">{set?.name || setId}</span>
        </div>

        {/* Set header */}
        {set && (
          <div className="card-base flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            {set.images?.logo && (
              <img
                src={set.images.logo}
                alt={set.name}
                className="h-16 object-contain flex-shrink-0"
              />
            )}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {set.images?.symbol && (
                  <img src={set.images.symbol} alt="" className="h-5 w-auto"/>
                )}
                <h1 className="text-2xl font-black">{set.name}</h1>
              </div>
              <p className="text-poke-muted text-sm">
                {set.series} · {set.total} cartes · {set.releaseDate}
                {set.ptcgoCode && ` · Code: ${set.ptcgoCode}`}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-poke-yellow">{total}</div>
              <div className="text-xs text-poke-muted">
                {rarityFilter ? 'résultats' : 'cartes totales'}
              </div>
            </div>
          </div>
        )}

        {/* Rarity filter */}
        <div className="mb-6">
          <p className="text-xs text-poke-muted uppercase tracking-wider mb-3">Filtrer par rareté</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setRarityFilter(''); setPage(1) }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                !rarityFilter
                  ? 'bg-poke-yellow text-black border-poke-yellow'
                  : 'border-poke-border text-poke-muted hover:border-poke-muted hover:text-white'
              }`}
            >
              Toutes
            </button>
            {RARITY_ORDER.map(r => (
              <button
                key={r}
                onClick={() => { setRarityFilter(r); setPage(1) }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  rarityFilter === r
                    ? 'bg-poke-yellow text-black border-poke-yellow'
                    : 'border-poke-border text-poke-muted hover:border-poke-muted hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 text-poke-muted">
            Aucune carte trouvée pour cette rareté.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {cards.map(card => (
                <PokemonCard key={card.id} card={card} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                {page > 1 && (
                  <button
                    onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0) }}
                    className="btn-secondary"
                  >
                    ← Précédent
                  </button>
                )}
                <span className="text-poke-muted text-sm">
                  Page {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <button
                    onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0) }}
                    className="btn-primary"
                  >
                    Suivant →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
