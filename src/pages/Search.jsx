import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PokemonCard from '../components/PokemonCard'
import LoadingGrid from '../components/LoadingGrid'
import EmptyState from '../components/EmptyState'
import { useSearch, useSets, useTypes, useRarities } from '../hooks/usePokemonAPI'

function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-poke-muted font-medium uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-poke-card border border-poke-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-poke-yellow transition-colors appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    set: searchParams.get('set') || '',
    type: searchParams.get('type') || '',
    rarity: searchParams.get('rarity') || '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { sets } = useSets()
  const types = useTypes()
  const rarities = useRarities()

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (filters.set) params.set = filters.set
    if (filters.type) params.type = filters.type
    if (filters.rarity) params.rarity = filters.rarity
    setSearchParams(params, { replace: true })
  }, [query, filters])

  const { data, loading, error } = useSearch(debouncedQuery, filters, page)

  const cards = data?.data || []
  const total = data?.totalCount || 0
  const hasMore = cards.length > 0 && page * 20 < total

  function updateFilter(key, val) {
    setFilters(f => ({ ...f, [key]: val }))
    setPage(1)
  }

  function clearAll() {
    setQuery('')
    setFilters({ set: '', type: '', rarity: '' })
    setPage(1)
  }

  const hasFilters = query || filters.set || filters.type || filters.rarity
  const activeFiltersCount = [filters.set, filters.type, filters.rarity].filter(Boolean).length

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Recherche de Cartes</h1>
          <p className="text-poke-muted">
            Explorez la base de données complète des cartes Pokémon TCG.
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Nom de la carte, ex: Dracaufeu..."
            autoFocus
          />
        </div>

        {/* Filter toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
              activeFiltersCount > 0
                ? 'border-poke-yellow text-poke-yellow bg-poke-yellow/10'
                : 'border-poke-border text-poke-muted hover:text-white hover:border-poke-muted'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            Filtres
            {activeFiltersCount > 0 && (
              <span className="bg-poke-yellow text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {hasFilters && (
            <button onClick={clearAll} className="text-sm text-poke-muted hover:text-poke-red transition-colors">
              Tout effacer
            </button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-poke-card border border-poke-border rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FilterSelect
                label="Extension"
                value={filters.set}
                onChange={v => updateFilter('set', v)}
                placeholder="Toutes les extensions"
                options={sets.map(s => ({ value: s.id, label: `${s.name} (${s.total})` }))}
              />
              <FilterSelect
                label="Type"
                value={filters.type}
                onChange={v => updateFilter('type', v)}
                placeholder="Tous les types"
                options={types.map(t => ({ value: t, label: t }))}
              />
              <FilterSelect
                label="Rareté"
                value={filters.rarity}
                onChange={v => updateFilter('rarity', v)}
                placeholder="Toutes les raretés"
                options={rarities.map(r => ({ value: r, label: r }))}
              />
            </div>
          </div>
        )}

        {/* Results header */}
        {!loading && data && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-poke-muted">
              {total > 0 ? (
                <><span className="text-white font-semibold">{total}</span> carte{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}</>
              ) : (
                'Aucune carte trouvée'
              )}
            </p>
            {total > 0 && (
              <p className="text-sm text-poke-muted">
                Page {page} / {Math.ceil(total / 20)}
              </p>
            )}
          </div>
        )}

        {/* Cards grid */}
        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-poke-red mb-2">Erreur lors du chargement</p>
            <p className="text-poke-muted text-sm">{error}</p>
          </div>
        ) : cards.length === 0 && hasFilters ? (
          <EmptyState
            icon="🔍"
            title="Aucune carte trouvée"
            description="Essayez avec un autre nom ou modifiez les filtres."
          />
        ) : cards.length === 0 ? (
          <EmptyState
            icon="🃏"
            title="Lancez une recherche"
            description="Tapez le nom d'une carte pour explorer la base de données Pokémon TCG."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {cards.map(card => (
                <PokemonCard key={card.id} card={card} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {page > 1 && (
                <button
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0) }}
                  className="btn-secondary"
                >
                  ← Précédent
                </button>
              )}
              {hasMore && (
                <button
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0) }}
                  className="btn-primary"
                >
                  Suivant →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
