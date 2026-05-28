import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSets } from '../hooks/usePokemonAPI'
import { useLang, translateEra, translateSet } from '../context/LanguageContext'
import { Spinner } from '../components/LoadingGrid'

const ERA_ORDER = [
  'Scarlet & Violet', 'Sword & Shield', 'Sun & Moon', 'XY',
  'Black & White', 'HeartGold & SoulSilver', 'Platinum', 'Diamond & Pearl',
  'EX', 'e-Card', 'Neo', 'Gym', 'Base', 'Other',
]

const ERA_COLORS = {
  'Scarlet & Violet':         'from-red-900/25 to-violet-900/25 border-red-700/30',
  'Sword & Shield':           'from-blue-900/25 to-red-900/25 border-blue-700/30',
  'Sun & Moon':               'from-orange-900/25 to-blue-900/25 border-orange-700/30',
  'XY':                       'from-blue-900/25 to-pink-900/25 border-blue-700/30',
  'Black & White':            'from-gray-800/40 to-gray-900/40 border-gray-600/30',
  'HeartGold & SoulSilver':   'from-yellow-900/25 to-gray-900/25 border-yellow-700/30',
  'Platinum':                 'from-slate-800/40 to-blue-900/25 border-slate-600/30',
  'Diamond & Pearl':          'from-blue-900/25 to-indigo-900/25 border-blue-700/30',
  'EX':                       'from-purple-900/25 to-blue-900/25 border-purple-700/30',
}

function getEraColor(era) {
  return ERA_COLORS[era] || 'from-poke-card to-poke-dark border-poke-border'
}

// ─── FRENCH / INTERNATIONAL ───────────────────────────────────────────────────
function FrenchSeries() {
  const { sets, loading } = useSets()
  const { lang } = useLang()
  const [openEra, setOpenEra] = useState(null)

  const grouped = useMemo(() => {
    const map = {}
    sets.forEach(s => {
      const era = s.series || 'Other'
      if (!map[era]) map[era] = []
      map[era].push(s)
    })
    const ordered = {}
    ERA_ORDER.forEach(era => { if (map[era]) ordered[era] = map[era] })
    Object.keys(map).forEach(era => { if (!ordered[era]) ordered[era] = map[era] })
    return ordered
  }, [sets])

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <Spinner size="lg" />
        <p className="text-poke-muted">Chargement des séries...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([era, eraSets]) => {
        const isOpen = openEra === era
        const totalCards = eraSets.reduce((sum, s) => sum + (s.total || 0), 0)
        const eraLabel = translateEra(era, lang)

        return (
          <div key={era} className={`rounded-2xl border bg-gradient-to-br overflow-hidden transition-all duration-300 ${getEraColor(era)}`}>
            {/* Era header — no logo, only name + count */}
            <button
              onClick={() => setOpenEra(isOpen ? null : era)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black">{eraLabel}</h2>
                <p className="text-sm text-poke-muted">
                  {eraSets.length} extension{eraSets.length > 1 ? 's' : ''} · {totalCards.toLocaleString('fr-FR')} cartes
                </p>
              </div>

              <div className="hidden sm:flex -space-x-1.5 mr-2">
                {eraSets.slice(0, 6).map(s =>
                  s.images?.symbol ? (
                    <img
                      key={s.id}
                      src={s.images.symbol}
                      alt=""
                      className="w-5 h-5 object-contain bg-black/20 rounded-full p-0.5"
                    />
                  ) : null
                )}
              </div>

              <svg
                className={`w-5 h-5 text-poke-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {/* Sets grid */}
            {isOpen && (
              <div className="border-t border-white/10 p-4 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {eraSets.map(set => (
                    <Link
                      key={set.id}
                      to={`/series/${set.id}`}
                      className="group bg-black/25 hover:bg-black/45 border border-white/10 hover:border-poke-yellow/50 rounded-xl p-3 transition-all duration-200 hover:scale-[1.03] flex flex-col items-center text-center"
                    >
                      {/* Set logo */}
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
                          {set.images?.symbol
                            ? <img src={set.images.symbol} alt="" className="h-8 w-8 object-contain"/>
                            : <span className="text-xs font-bold">{set.name}</span>
                          }
                        </div>
                      )}
                      <p className="text-xs font-semibold leading-tight">
                        {translateSet(set.name, lang)}
                      </p>
                      <p className="text-xs text-poke-muted mt-0.5">{set.total} cartes</p>
                      {set.releaseDate && (
                        <p className="text-xs text-poke-muted/60">{set.releaseDate.slice(0, 4)}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── COMING SOON placeholder ──────────────────────────────────────────────────
function ComingSoon({ flag, lang: langLabel, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-7xl mb-4">{flag}</div>
      <h3 className="text-2xl font-black mb-2">Séries {langLabel}</h3>
      <p className="text-poke-muted max-w-md mb-6 leading-relaxed">{message}</p>
      <div className="inline-flex items-center gap-2 bg-poke-yellow/10 border border-poke-yellow/20 rounded-full px-5 py-2">
        <div className="w-2 h-2 rounded-full bg-poke-yellow animate-pulse"/>
        <span className="text-poke-yellow text-sm font-semibold">Intégration en cours</span>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const LANG_TABS = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'jp', flag: '🇯🇵', label: 'Japonais' },
  { code: 'zh', flag: '🇨🇳', label: 'Chinois' },
]

export default function Series() {
  const { sets } = useSets()
  const [activeTab, setActiveTab] = useState('fr')

  const totalSets = sets.length
  const totalCards = sets.reduce((sum, s) => sum + (s.total || 0), 0)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header + language tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-1">Séries Pokémon TCG</h1>
            {activeTab === 'fr' && (
              <p className="text-poke-muted text-sm">
                {Object.keys({}).length > 0 ? '' : `${totalSets} extensions · ${totalCards.toLocaleString('fr-FR')} cartes`}
              </p>
            )}
          </div>

          {/* Language tab pills */}
          <div className="flex items-center gap-2 bg-poke-card border border-poke-border rounded-2xl p-1.5">
            {LANG_TABS.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setActiveTab(code)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === code
                    ? 'bg-poke-yellow text-black shadow-md'
                    : 'text-poke-muted hover:text-white'
                }`}
              >
                <span className="text-base">{flag}</span>
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'fr' && <FrenchSeries />}

        {activeTab === 'jp' && (
          <ComingSoon
            flag="🇯🇵"
            lang="Japonaises"
            message="Les séries japonaises du Pokémon Card Game (JCC) proviennent d'une base de données distincte. Leur intégration est en cours de développement."
          />
        )}

        {activeTab === 'zh' && (
          <ComingSoon
            flag="🇨🇳"
            lang="Chinoises"
            message="Les séries chinoises (版本) sont publiées par Pokémon Company International et Tencent Games. Leur intégration sera disponible prochainement."
          />
        )}
      </div>
    </div>
  )
}
