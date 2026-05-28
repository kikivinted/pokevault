import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSets } from '../hooks/usePokemonAPI'
import { Spinner } from '../components/LoadingGrid'

const ERA_ORDER = [
  'Scarlet & Violet',
  'Sword & Shield',
  'Sun & Moon',
  'XY',
  'Black & White',
  'HeartGold & SoulSilver',
  'Platinum',
  'Diamond & Pearl',
  'EX',
  'e-Card',
  'Neo',
  'Gym',
  'Base',
  'Other',
]

const ERA_COLORS = {
  'Scarlet & Violet': 'from-red-900/30 to-violet-900/30 border-red-700/40',
  'Sword & Shield':   'from-blue-900/30 to-red-900/30 border-blue-700/40',
  'Sun & Moon':       'from-orange-900/30 to-blue-900/30 border-orange-700/40',
  'XY':               'from-blue-900/30 to-pink-900/30 border-blue-700/40',
  'Black & White':    'from-gray-800/50 to-gray-900/50 border-gray-600/40',
  'HeartGold & SoulSilver': 'from-yellow-900/30 to-gray-900/30 border-yellow-700/40',
  'Platinum':         'from-slate-800/50 to-blue-900/30 border-slate-600/40',
  'Diamond & Pearl':  'from-blue-900/30 to-indigo-900/30 border-blue-700/40',
  'EX':               'from-purple-900/30 to-blue-900/30 border-purple-700/40',
}

function getEraColor(era) {
  return ERA_COLORS[era] || 'from-poke-card to-poke-dark border-poke-border'
}

export default function Series() {
  const { sets, loading } = useSets()
  const [openEra, setOpenEra] = useState(null)

  const grouped = useMemo(() => {
    const map = {}
    sets.forEach(s => {
      const era = s.series || 'Other'
      if (!map[era]) map[era] = []
      map[era].push(s)
    })
    const ordered = {}
    ERA_ORDER.forEach(era => {
      if (map[era]) ordered[era] = map[era]
    })
    Object.keys(map).forEach(era => {
      if (!ordered[era]) ordered[era] = map[era]
    })
    return ordered
  }, [sets])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-poke-muted mt-4">Chargement des séries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title mb-2">Séries Pokémon TCG</h1>
          <p className="text-poke-muted">
            {Object.keys(grouped).length} blocs · {sets.length} extensions
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([era, eraSets]) => {
            const isOpen = openEra === era
            const totalCards = eraSets.reduce((sum, s) => sum + (s.total || 0), 0)
            const representativeSet = eraSets[0]

            return (
              <div key={era} className={`rounded-2xl border bg-gradient-to-br overflow-hidden transition-all duration-300 ${getEraColor(era)}`}>
                {/* Era header */}
                <button
                  onClick={() => setOpenEra(isOpen ? null : era)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left"
                >
                  {/* Logo du premier set de l'ère */}
                  <div className="w-24 h-12 flex items-center justify-start flex-shrink-0">
                    {representativeSet?.images?.logo ? (
                      <img
                        src={representativeSet.images.logo}
                        alt={era}
                        className="max-h-10 max-w-full object-contain brightness-90"
                      />
                    ) : (
                      <span className="text-lg font-black text-white/70">{era}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-black">{era}</h2>
                    <p className="text-sm text-poke-muted">
                      {eraSets.length} extension{eraSets.length > 1 ? 's' : ''} · {totalCards.toLocaleString()} cartes
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:flex -space-x-2">
                      {eraSets.slice(0, 5).map(s => (
                        s.images?.symbol && (
                          <img
                            key={s.id}
                            src={s.images.symbol}
                            alt={s.name}
                            className="w-6 h-6 object-contain bg-black/30 rounded-full p-0.5"
                          />
                        )
                      ))}
                    </div>
                    <svg
                      className={`w-5 h-5 text-poke-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>

                {/* Sets grid */}
                {isOpen && (
                  <div className="border-t border-white/10 p-4 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {eraSets.map(set => (
                        <Link
                          key={set.id}
                          to={`/series/${set.id}`}
                          className="group bg-black/30 hover:bg-black/50 border border-white/10 hover:border-poke-yellow/50 rounded-xl p-3 transition-all duration-200 hover:scale-105"
                        >
                          {set.images?.logo ? (
                            <div className="h-10 flex items-center justify-center mb-2">
                              <img
                                src={set.images.logo}
                                alt={set.name}
                                className="max-h-10 max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="h-10 flex items-center justify-center mb-2">
                              <span className="text-xs font-bold text-center leading-tight">{set.name}</span>
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-xs font-semibold truncate">{set.name}</p>
                            <p className="text-xs text-poke-muted">{set.total} cartes</p>
                            {set.releaseDate && (
                              <p className="text-xs text-poke-muted/60">{set.releaseDate.slice(0, 4)}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
