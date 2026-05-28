import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '../components/LoadingGrid'

const BASE_URL = 'https://api.pokemontcg.io/v2'

function getPrice(card) {
  return card.cardmarket?.prices?.averageSellPrice
    || card.tcgplayer?.prices?.holofoil?.market
    || card.tcgplayer?.prices?.normal?.market
    || 0
}

function PriceCard({ card }) {
  const price = getPrice(card)
  return (
    <Link
      to={`/carte/${card.id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-poke-card border border-transparent hover:border-poke-border transition-all group"
    >
      <img
        src={card.images?.small}
        alt={card.name}
        className="h-16 w-11 object-contain rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm group-hover:text-poke-yellow transition-colors truncate">{card.name}</p>
        <p className="text-xs text-poke-muted truncate">{card.set?.name}</p>
        {card.rarity && <p className="text-xs text-poke-muted/70">{card.rarity}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-black text-poke-yellow text-base">{price > 0 ? `${price.toFixed(2)} €` : '—'}</p>
      </div>
    </Link>
  )
}

function MarketSection({ title, cards, loading, icon }) {
  return (
    <div className="card-base">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-black text-lg">{title}</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-1">
          {cards.map(card => <PriceCard key={card.id} card={card} />)}
        </div>
      )}
    </div>
  )
}

function useMarketCards(query, pageSize = 10) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/cards?${query}&pageSize=${pageSize}`)
      .then(r => r.json())
      .then(d => { setCards(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [query])

  return { cards, loading }
}

const PREMIUM_FEATURES = [
  { icon: '📈', title: 'Alertes de prix', desc: 'Recevez une notification quand une carte dépasse un seuil de valeur.' },
  { icon: '📊', title: 'Historique des prix', desc: 'Suivez l\'évolution des prix sur 1 an pour chaque carte.' },
  { icon: '🔔', title: 'Nouvelles sorties', desc: 'Soyez alerté des nouvelles extensions et cartes exclusives.' },
  { icon: '💎', title: 'Cartes rares exclusives', desc: 'Accédez à la liste complète des cartes les plus rares du marché.' },
  { icon: '🔍', title: 'Scanner illimité', desc: 'Scannez et stockez vos cartes en haute résolution sans limite.' },
  { icon: '📱', title: 'App mobile', desc: 'Accédez à votre collection depuis l\'application mobile dédiée.' },
]

export default function Marche() {
  const { cards: topCards, loading: topLoading } = useMarketCards(
    'q=rarity:"Hyper Rare"&orderBy=-cardmarket.prices.averageSellPrice'
  )
  const { cards: svCards, loading: svLoading } = useMarketCards(
    'q=set.series:"Scarlet & Violet" rarity:"Special Illustration Rare"&orderBy=-cardmarket.prices.averageSellPrice'
  )
  const { cards: classicCards, loading: classicLoading } = useMarketCards(
    'q=name:Charizard rarity:"Rare Holo"&orderBy=-cardmarket.prices.averageSellPrice'
  )

  // Filter to only cards with prices
  const topWithPrice = topCards.filter(c => getPrice(c) > 0).slice(0, 8)
  const svWithPrice = svCards.filter(c => getPrice(c) > 0).slice(0, 8)
  const classicWithPrice = classicCards.filter(c => getPrice(c) > 0).slice(0, 8)

  const topPrice = topWithPrice[0] ? getPrice(topWithPrice[0]) : 0

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Marché</h1>
          <p className="text-poke-muted">Suivez les tendances du marché des cartes Pokémon TCG.</p>
        </div>

        {/* Market overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Carte #1 du moment', value: topPrice > 0 ? `${topPrice.toFixed(0)} €` : '—', icon: '🏆', sub: 'Prix le plus élevé' },
            { label: 'Cartes suivies', value: '20 000+', icon: '📋', sub: 'Base de données' },
            { label: 'Prix mis à jour', value: 'Quotidien', icon: '🔄', sub: 'Via CardMarket' },
            { label: 'Sources de prix', value: '2', icon: '💱', sub: 'CardMarket & TCGPlayer' },
          ].map(({ label, value, icon, sub }) => (
            <div key={label} className="card-base text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-black text-xl text-poke-yellow">{value}</div>
              <div className="text-xs font-medium mt-0.5">{label}</div>
              <div className="text-xs text-poke-muted mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Market sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <MarketSection
            title="Top Hyper Rares"
            icon="✨"
            cards={topWithPrice}
            loading={topLoading}
          />
          <MarketSection
            title="Scarlet & Violet — SIR"
            icon="🔴"
            cards={svWithPrice}
            loading={svLoading}
          />
          <MarketSection
            title="Classiques Dracaufeu"
            icon="🔥"
            cards={classicWithPrice}
            loading={classicLoading}
          />
        </div>

        {/* Premium teaser */}
        <div className="relative overflow-hidden rounded-3xl border border-poke-yellow/20 bg-gradient-to-br from-poke-yellow/5 to-poke-blue/5 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-poke-yellow/5 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"/>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-poke-yellow text-black text-xs font-black px-3 py-1 rounded-full tracking-wider uppercase">
                Bientôt
              </span>
              <span className="text-poke-yellow font-bold text-lg">PokéVault Premium</span>
            </div>

            <h2 className="text-3xl font-black mb-3">
              Allez plus loin<br/>avec le Premium
            </h2>
            <p className="text-poke-muted max-w-xl mb-8 leading-relaxed">
              Des fonctionnalités avancées pour les collectionneurs sérieux — alertes de prix,
              historique détaillé, scan illimité et bien plus encore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {PREMIUM_FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 bg-black/20 rounded-xl p-4 border border-white/5">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-xs text-poke-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="btn-primary py-3.5 px-8 text-base opacity-60 cursor-not-allowed" disabled>
                🔔 Me notifier au lancement
              </button>
              <p className="text-sm text-poke-muted">
                Disponible prochainement · Tarifs à confirmer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
