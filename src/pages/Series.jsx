import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSets } from '../hooks/usePokemonAPI'
import { useLang, useT, translateEra, translateSet } from '../context/LanguageContext'
import { JAPANESE_ERAS } from '../data/japaneseSets'
import { CHINESE_ERAS } from '../data/chineseSets'
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

// ── International (FR / EN) ────────────────────────────────────────────────────
function InternationalSeries({ lang }) {
  const { sets, loading } = useSets()
  const [openEra, setOpenEra] = useState(null)
  const t = useT()

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
        <p className="text-poke-muted">{t('loading')}</p>
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
            <button
              onClick={() => setOpenEra(isOpen ? null : era)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black">{eraLabel}</h2>
                <p className="text-sm text-poke-muted">
                  {t('sets_count')(eraSets.length)} · {t('cards_count')(totalCards)}
                </p>
              </div>

              <div className="hidden sm:flex -space-x-1.5 mr-2">
                {eraSets.slice(0, 6).map(s =>
                  s.images?.symbol
                    ? <img key={s.id} src={s.images.symbol} alt="" className="w-5 h-5 object-contain bg-black/20 rounded-full p-0.5"/>
                    : null
                )}
              </div>

              <svg
                className={`w-5 h-5 text-poke-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-white/10 p-4 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {eraSets.map(set => (
                    <Link
                      key={set.id}
                      to={`/series/${set.id}`}
                      className="group bg-black/25 hover:bg-black/45 border border-white/10 hover:border-poke-yellow/50 rounded-xl p-3 transition-all duration-200 hover:scale-[1.03] flex flex-col items-center text-center"
                    >
                      {set.images?.logo ? (
                        <div className="h-10 flex items-center justify-center mb-2">
                          <img src={set.images.logo} alt={set.name} className="max-h-10 max-w-full object-contain"/>
                        </div>
                      ) : (
                        <div className="h-10 flex items-center justify-center mb-2">
                          {set.images?.symbol
                            ? <img src={set.images.symbol} alt="" className="h-8 w-8 object-contain"/>
                            : <span className="text-xs font-bold">{set.name}</span>
                          }
                        </div>
                      )}
                      <p className="text-xs font-semibold leading-tight">{translateSet(set.name, lang)}</p>
                      <p className="text-xs text-poke-muted mt-0.5">{set.total} cartes</p>
                      {set.releaseDate && <p className="text-xs text-poke-muted/60">{set.releaseDate.slice(0,4)}</p>}
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

// ── Japanese ──────────────────────────────────────────────────────────────────
function JapaneseSeries({ lang }) {
  const [openEra, setOpenEra] = useState(null)
  const t = useT()
  const navigate = useNavigate()

  function handleSetClick(set) {
    if (set.internationalId) {
      navigate(`/series/${set.internationalId}`)
    } else {
      navigate(`/series/jp/${set.id}`)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 bg-yellow-900/10 border border-yellow-700/20 rounded-2xl mb-4">
        <span className="text-2xl">ℹ️</span>
        <p className="text-sm text-yellow-200/80 leading-relaxed">
          Les sets avec ⭐ redirigent vers les cartes de leur version internationale correspondante.
          Les sets exclusifs Japon afficheront leurs informations.
        </p>
      </div>

      {JAPANESE_ERAS.map(({ era, eraFr, eraEn, color, sets }) => {
        const isOpen = openEra === era
        const totalCards = sets.reduce((sum, s) => sum + (s.total || 0), 0)
        const eraLabel = lang === 'jp' ? era : lang === 'en' ? eraEn : eraFr

        return (
          <div key={era} className={`rounded-2xl border bg-gradient-to-br overflow-hidden transition-all duration-300 ${color}`}>
            <button
              onClick={() => setOpenEra(isOpen ? null : era)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-black">{eraLabel}</h2>
                  {lang !== 'jp' && <span className="text-xs text-poke-muted">({era})</span>}
                </div>
                <p className="text-sm text-poke-muted">
                  {t('sets_count')(sets.length)} · {t('cards_count')(totalCards)}
                </p>
              </div>

              <svg
                className={`w-5 h-5 text-poke-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-white/10 p-4 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {sets.map(set => {
                    const setLabel = lang === 'jp' ? set.nameJp : lang === 'en' ? set.nameEn : set.nameFr
                    return (
                      <button
                        key={set.id}
                        onClick={() => handleSetClick(set)}
                        className="group bg-black/25 hover:bg-black/45 border border-white/10 hover:border-poke-yellow/50 rounded-xl p-3 transition-all duration-200 hover:scale-[1.03] flex flex-col items-center text-center"
                      >
                        {/* Japanese text logo placeholder */}
                        <div className="h-10 flex items-center justify-center mb-2 w-full">
                          <span className="text-xs font-bold text-white/70 leading-tight text-center line-clamp-2 px-1"
                            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
                            {set.nameJp}
                          </span>
                        </div>
                        <p className="text-xs font-semibold leading-tight">{setLabel}</p>
                        <p className="text-xs text-poke-muted mt-0.5">{set.total} cartes</p>
                        <div className="flex items-center gap-1 mt-1">
                          {set.releaseDate && <p className="text-xs text-poke-muted/60">{set.releaseDate.slice(0,4)}</p>}
                          {set.internationalId && <span className="text-xs text-poke-yellow/80">⭐</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Chinese ───────────────────────────────────────────────────────────────────
function ChineseSeries({ lang }) {
  const [openEra, setOpenEra] = useState(null)
  const t = useT()

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 bg-red-900/10 border border-red-700/20 rounded-2xl mb-4">
        <span className="text-2xl">ℹ️</span>
        <p className="text-sm text-red-200/80 leading-relaxed">
          Jeu de cartes chinois simplifié (简体中文), publié par Pokémon Company et Tencent Games depuis 2020.
          Certains sets correspondent aux versions internationales.
        </p>
      </div>

      {CHINESE_ERAS.map(({ era, eraFr, eraEn, color, sets }) => {
        const isOpen = openEra === era
        const totalCards = sets.reduce((sum, s) => sum + (s.total || 0), 0)
        const eraLabel = lang === 'zh' ? era : lang === 'en' ? eraEn : eraFr

        return (
          <div key={era} className={`rounded-2xl border bg-gradient-to-br overflow-hidden transition-all duration-300 ${color}`}>
            <button
              onClick={() => setOpenEra(isOpen ? null : era)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-black">{eraLabel}</h2>
                  {lang !== 'zh' && <span className="text-xs text-poke-muted">({era})</span>}
                </div>
                <p className="text-sm text-poke-muted">
                  {t('sets_count')(sets.length)} · {t('cards_count')(totalCards)}
                </p>
              </div>

              <svg
                className={`w-5 h-5 text-poke-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-white/10 p-4 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {sets.map(set => {
                    const setLabel = lang === 'zh' ? set.nameZh : lang === 'en' ? set.nameEn : set.nameFr
                    return (
                      <div
                        key={set.id}
                        className="bg-black/25 border border-white/10 hover:border-red-500/40 rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] flex flex-col items-center text-center cursor-default"
                      >
                        <div className="h-10 flex items-center justify-center mb-2 w-full">
                          <span className="text-sm font-bold text-white/80 leading-tight text-center line-clamp-2 px-1">
                            {set.nameZh}
                          </span>
                        </div>
                        <p className="text-xs font-semibold leading-tight">{setLabel}</p>
                        <p className="text-xs text-poke-muted mt-0.5">{set.total} cartes</p>
                        {set.releaseDate && <p className="text-xs text-poke-muted/60">{set.releaseDate.slice(0,4)}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Series() {
  const { lang } = useLang()
  const t = useT()
  const { sets } = useSets()
  const [activeTab, setActiveTab] = useState('fr')

  const TABS = [
    { code: 'fr', flag: '🇫🇷', label: t('series_tabs_fr') },
    { code: 'en', flag: '🇬🇧', label: t('series_tabs_en') },
    { code: 'jp', flag: '🇯🇵', label: t('series_tabs_jp') },
    { code: 'zh', flag: '🇨🇳', label: t('series_tabs_zh') },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-1">{t('series_title')}</h1>
          </div>

          {/* Language tabs */}
          <div className="flex items-center gap-1.5 bg-poke-card border border-poke-border rounded-2xl p-1.5">
            {TABS.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setActiveTab(code)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === code
                    ? 'bg-poke-yellow text-black shadow-md'
                    : 'text-poke-muted hover:text-white'
                }`}
              >
                <span className="text-base">{flag}</span>
                <span className="hidden sm:block text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {(activeTab === 'fr' || activeTab === 'en') && (
          <InternationalSeries lang={activeTab} />
        )}
        {activeTab === 'jp' && <JapaneseSeries lang={lang} />}
        {activeTab === 'zh' && <ChineseSeries lang={lang} />}
      </div>
    </div>
  )
}
