import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'
import EmptyState from '../components/EmptyState'

function StatCard({ label, value, sublabel, color = 'yellow' }) {
  const colors = {
    yellow: 'text-poke-yellow',
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-poke-red',
    purple: 'text-purple-400',
  }
  return (
    <div className="card-base text-center">
      <div className={`text-3xl font-black ${colors[color]} mb-1`}>{value}</div>
      <div className="text-sm font-semibold">{label}</div>
      {sublabel && <div className="text-xs text-poke-muted mt-0.5">{sublabel}</div>}
    </div>
  )
}

function BarChart({ data, title, colorFn }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="card-base">
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="space-y-2">
        {data.slice(0, 10).map(({ label, value, extra }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-sm text-poke-muted w-28 truncate flex-shrink-0">{label}</span>
            <div className="flex-1 bg-poke-border rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(value / max) * 100}%`,
                  background: colorFn ? colorFn(label) : '#FFDE00',
                }}
              />
            </div>
            <span className="text-sm font-semibold w-16 text-right flex-shrink-0">
              {extra || value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TYPE_COLORS = {
  Fire: '#ff4400', Water: '#0082ff', Grass: '#00b450', Lightning: '#ffd200',
  Psychic: '#c800c8', Fighting: '#b45000', Darkness: '#6600cc', Metal: '#aaaacc',
  Dragon: '#6400c8', Colorless: '#888888', Fairy: '#ff64b4',
}

export default function Stats() {
  const { cards, totalCards, totalValue, uniqueCards, wishlist } = useCollection()

  const stats = useMemo(() => {
    if (cards.length === 0) return null

    const byType = {}
    const byRarity = {}
    const bySet = {}
    let withPrice = 0
    let mostValuable = null
    let mostDuplicates = null

    cards.forEach(c => {
      const price = c.cardmarket?.prices?.averageSellPrice
        || c.tcgplayer?.prices?.holofoil?.market
        || c.tcgplayer?.prices?.normal?.market
        || 0

      if (price > 0) withPrice++

      if (!mostValuable || price > getPrice(mostValuable)) mostValuable = c
      if (!mostDuplicates || c.quantity > mostDuplicates.quantity) mostDuplicates = c

      c.types?.forEach(t => {
        byType[t] = (byType[t] || 0) + c.quantity
      })

      if (c.rarity) {
        byRarity[c.rarity] = (byRarity[c.rarity] || 0) + 1
      }

      if (c.set?.name) {
        bySet[c.set.name] = (bySet[c.set.name] || 0) + c.quantity
      }
    })

    const avgPrice = withPrice > 0 ? totalValue / withPrice : 0
    const mostExpensive = cards.reduce((best, c) => {
      const p = getPrice(c)
      return p > getPrice(best) ? c : best
    }, cards[0])

    return { byType, byRarity, bySet, avgPrice, mostExpensive, mostDuplicates }
  }, [cards, totalValue])

  function getPrice(card) {
    if (!card) return 0
    return card.cardmarket?.prices?.averageSellPrice
      || card.tcgplayer?.prices?.holofoil?.market
      || card.tcgplayer?.prices?.normal?.market
      || 0
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title mb-2">Statistiques</h1>
          <EmptyState
            icon="📊"
            title="Pas encore de statistiques"
            description="Ajoutez des cartes à votre collection pour voir vos statistiques détaillées."
            action="/recherche"
            actionLabel="🔍 Chercher des cartes"
          />
        </div>
      </div>
    )
  }

  const typeData = Object.entries(stats.byType)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))

  const rarityData = Object.entries(stats.byRarity)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))

  const setData = Object.entries(stats.bySet)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))

  const mostExpensivePrice = getPrice(stats.mostExpensive)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title mb-2">Statistiques</h1>
          <p className="text-poke-muted">Vue d'ensemble de votre collection.</p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Cartes uniques" value={uniqueCards} color="yellow" />
          <StatCard label="Exemplaires" value={totalCards} color="blue" />
          <StatCard label="Valeur totale" value={`${totalValue.toFixed(0)} €`} color="green" />
          <StatCard label="Prix moyen" value={`${stats.avgPrice.toFixed(2)} €`} color="purple" />
          <StatCard label="Wishlist" value={wishlist.length} color="red" />
          <StatCard label="Extensions" value={Object.keys(stats.bySet).length} color="yellow" />
        </div>

        {/* Highlights */}
        {(stats.mostExpensive || stats.mostDuplicates) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {stats.mostExpensive && (
              <div className="card-base flex items-center gap-4">
                <img
                  src={stats.mostExpensive.images?.small}
                  alt={stats.mostExpensive.name}
                  className="h-20 w-14 object-contain rounded-lg flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-poke-muted uppercase tracking-wider mb-1">Carte la plus chère</p>
                  <Link to={`/carte/${stats.mostExpensive.id}`} className="font-bold hover:text-poke-yellow transition-colors">
                    {stats.mostExpensive.name}
                  </Link>
                  <p className="text-2xl font-black text-poke-yellow mt-1">
                    {mostExpensivePrice > 0 ? `${mostExpensivePrice.toFixed(2)} €` : '—'}
                  </p>
                </div>
              </div>
            )}
            {stats.mostDuplicates && stats.mostDuplicates.quantity > 1 && (
              <div className="card-base flex items-center gap-4">
                <img
                  src={stats.mostDuplicates.images?.small}
                  alt={stats.mostDuplicates.name}
                  className="h-20 w-14 object-contain rounded-lg flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-poke-muted uppercase tracking-wider mb-1">Plus d'exemplaires</p>
                  <Link to={`/carte/${stats.mostDuplicates.id}`} className="font-bold hover:text-poke-yellow transition-colors">
                    {stats.mostDuplicates.name}
                  </Link>
                  <p className="text-2xl font-black text-poke-yellow mt-1">
                    × {stats.mostDuplicates.quantity}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {typeData.length > 0 && (
            <BarChart
              title="Cartes par type"
              data={typeData}
              colorFn={label => TYPE_COLORS[label] || '#FFDE00'}
            />
          )}
          {rarityData.length > 0 && (
            <BarChart
              title="Cartes par rareté"
              data={rarityData}
            />
          )}
        </div>

        {setData.length > 0 && (
          <BarChart
            title="Extensions les plus représentées"
            data={setData}
          />
        )}

        {/* Value breakdown */}
        <div className="card-base mt-6">
          <h3 className="font-bold mb-4">Top 10 — Valeur par carte</h3>
          <div className="space-y-2">
            {[...cards]
              .sort((a, b) => (getPrice(b) * b.quantity) - (getPrice(a) * a.quantity))
              .slice(0, 10)
              .map((card, i) => {
                const price = getPrice(card)
                const total = price * card.quantity
                return (
                  <div key={card.id} className="flex items-center gap-3 py-2 border-b border-poke-border/50 last:border-0">
                    <span className="text-poke-muted text-sm w-6 text-right">{i + 1}.</span>
                    <img src={card.images?.small} alt={card.name} className="h-10 w-7 object-contain rounded flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <Link to={`/carte/${card.id}`} className="font-semibold text-sm hover:text-poke-yellow transition-colors truncate block">
                        {card.name}
                      </Link>
                      <span className="text-xs text-poke-muted">{card.set?.name}</span>
                    </div>
                    <span className="text-xs text-poke-muted">×{card.quantity}</span>
                    <span className="font-bold text-poke-yellow text-sm w-20 text-right">
                      {total > 0 ? `${total.toFixed(2)} €` : '—'}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
