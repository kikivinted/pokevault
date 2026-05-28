import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QuickSearchBar } from '../components/SearchBar'
import { useCollection } from '../context/CollectionContext'

const FEATURES = [
  {
    icon: '🔍',
    title: 'Recherche Avancée',
    desc: 'Trouvez n\'importe quelle carte parmi des milliers. Filtrez par type, rareté, extension.',
  },
  {
    icon: '📦',
    title: 'Gestion de Collection',
    desc: 'Ajoutez vos cartes, suivez vos quantités et organisez votre collection facilement.',
  },
  {
    icon: '💰',
    title: 'Valeur en Temps Réel',
    desc: 'Consultez les prix du marché grâce aux données CardMarket & TCGPlayer actualisées.',
  },
  {
    icon: '📊',
    title: 'Statistiques Détaillées',
    desc: 'Analysez votre collection : répartition par type, rareté, valeur totale et évolution.',
  },
  {
    icon: '❤️',
    title: 'Wishlist',
    desc: 'Sauvegardez les cartes dont vous rêvez et suivez leur disponibilité.',
  },
  {
    icon: '⚡',
    title: 'Ultra Rapide',
    desc: 'Application 100% locale, aucune inscription requise. Vos données restent chez vous.',
  },
]

const POPULAR = [
  'Charizard', 'Pikachu', 'Mewtwo', 'Rayquaza', 'Umbreon', 'Gengar',
]

const HIGHLIGHTS = [
  { emoji: '🃏', label: '20 000+', sublabel: 'cartes disponibles' },
  { emoji: '📈', label: 'Prix live', sublabel: 'CardMarket & TCG' },
  { emoji: '💾', label: '100% local', sublabel: 'sans compte' },
  { emoji: '🆓', label: 'Gratuit', sublabel: 'pour toujours' },
]

export default function Home() {
  const { totalCards, totalValue, uniqueCards } = useCollection()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-bg pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Decorative Poké Balls */}
        <div className="absolute -top-20 -right-20 w-64 h-64 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <circle cx="50" cy="50" r="45" fill="#FFDE00"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
            <rect x="5" y="44" width="90" height="12" fill="#fff"/>
            <circle cx="50" cy="50" r="14" fill="#fff"/>
            <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
          </svg>
        </div>
        <div className="absolute bottom-10 -left-16 w-48 h-48 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" style={{ animationDirection: 'reverse' }}>
            <circle cx="50" cy="50" r="45" fill="#3B4CCA"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
            <rect x="5" y="44" width="90" height="12" fill="#fff"/>
            <circle cx="50" cy="50" r="14" fill="#fff"/>
            <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
          </svg>
        </div>

        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {totalCards > 0 && (
            <div className="inline-flex items-center gap-2 bg-poke-yellow/10 border border-poke-yellow/30 rounded-full px-4 py-1.5 mb-6 text-sm">
              <span className="text-poke-yellow font-semibold">{totalCards} cartes</span>
              <span className="text-poke-muted">dans votre collection</span>
              <span className="text-poke-yellow font-semibold">· {totalValue.toFixed(2)} €</span>
            </div>
          )}

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-none">
            Votre coffre-fort<br/>
            <span className="gradient-text">Pokémon</span>
          </h1>

          <p className="text-xl text-poke-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Gérez votre collection de cartes Pokémon. Recherchez, organisez, évaluez.
            Tout en un, sans inscription, entièrement gratuit.
          </p>

          <div className="mb-10">
            <QuickSearchBar />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-poke-muted text-sm">Populaires :</span>
            {POPULAR.map(name => (
              <Link
                key={name}
                to={`/recherche?q=${encodeURIComponent(name)}`}
                className="text-sm px-3 py-1.5 bg-poke-card border border-poke-border rounded-full hover:border-poke-yellow hover:text-poke-yellow transition-all duration-200"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {HIGHLIGHTS.map(({ emoji, label, sublabel }) => (
            <div key={label} className="card-base text-center">
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-black text-lg text-poke-yellow">{label}</div>
              <div className="text-xs text-poke-muted">{sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection preview if exists */}
      {totalCards > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Votre Collection</h2>
              <Link to="/collection" className="text-poke-yellow text-sm hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card-base text-center">
                <div className="text-4xl font-black text-poke-yellow">{uniqueCards}</div>
                <div className="text-poke-muted text-sm mt-1">Cartes uniques</div>
              </div>
              <div className="card-base text-center">
                <div className="text-4xl font-black text-poke-yellow">{totalCards}</div>
                <div className="text-poke-muted text-sm mt-1">Total d'exemplaires</div>
              </div>
              <div className="card-base text-center col-span-2 md:col-span-1">
                <div className="text-4xl font-black text-poke-yellow">{totalValue.toFixed(2)} €</div>
                <div className="text-poke-muted text-sm mt-1">Valeur estimée</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Tout ce dont vous avez besoin</h2>
            <p className="text-poke-muted max-w-xl mx-auto">
              PokéVault centralise tous les outils du collectionneur dans une seule application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card-base hover:scale-[1.02] transition-transform duration-300 cursor-default">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-poke-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-poke-yellow/10 to-poke-blue/10 border border-poke-yellow/20 rounded-3xl p-12">
            <h2 className="section-title mb-4">Prêt à commencer ?</h2>
            <p className="text-poke-muted mb-8">
              Recherchez votre première carte et ajoutez-la à votre collection en un clic.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/recherche" className="btn-primary text-lg px-8 py-4">
                🔍 Chercher des cartes
              </Link>
              <Link to="/collection" className="btn-secondary text-lg px-8 py-4">
                📦 Ma Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
