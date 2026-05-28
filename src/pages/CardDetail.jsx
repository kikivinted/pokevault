import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCard } from '../hooks/usePokemonAPI'
import { useCollection } from '../context/CollectionContext'
import { Spinner } from '../components/LoadingGrid'

function getTypeClass(type) {
  const map = {
    Fire: 'type-fire', Water: 'type-water', Grass: 'type-grass',
    Lightning: 'type-lightning', Psychic: 'type-psychic', Fighting: 'type-fighting',
    Darkness: 'type-darkness', Metal: 'type-metal', Dragon: 'type-dragon',
    Colorless: 'type-colorless', Fairy: 'type-fairy',
  }
  return map[type] || 'type-default'
}

function PriceTag({ label, value, highlight }) {
  if (!value) return null
  return (
    <div className={`flex items-center justify-between py-2 border-b border-poke-border/50 last:border-0`}>
      <span className="text-sm text-poke-muted">{label}</span>
      <span className={`font-bold ${highlight ? 'text-poke-yellow text-lg' : 'text-white'}`}>
        {value.toFixed(2)} €
      </span>
    </div>
  )
}

function StatLine({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-2 border-b border-poke-border/50 last:border-0">
      <span className="text-sm text-poke-muted">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export default function CardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: card, loading, error } = useCard(id)
  const { dispatch, isInCollection, isInWishlist, getQuantity } = useCollection()
  const [imgView, setImgView] = useState('small')

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-poke-muted mt-4">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <p className="text-poke-red mb-4">Carte introuvable.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">← Retour</button>
      </div>
    )
  }

  const inCollection = isInCollection(card.id)
  const inWishlist = isInWishlist(card.id)
  const qty = getQuantity(card.id)

  const cmPrices = card.cardmarket?.prices
  const tcgPrices = card.tcgplayer?.prices

  const avgPrice = cmPrices?.averageSellPrice
    || tcgPrices?.holofoil?.market
    || tcgPrices?.normal?.market

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-poke-muted mb-8">
          <Link to="/" className="hover:text-poke-yellow transition-colors">Accueil</Link>
          <span>›</span>
          <Link to="/recherche" className="hover:text-poke-yellow transition-colors">Recherche</Link>
          <span>›</span>
          <span className="text-white">{card.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group max-w-sm mx-auto w-full">
              {card.images?.large && (
                <img
                  src={imgView === 'large' && card.images.large ? card.images.large : card.images.small || card.images.large}
                  alt={card.name}
                  className="w-full rounded-2xl shadow-2xl shadow-black/50 transition-transform duration-300 group-hover:scale-[1.02]"
                />
              )}
              {card.images?.large && (
                <button
                  onClick={() => setImgView(v => v === 'small' ? 'large' : 'small')}
                  className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-xs px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors"
                >
                  {imgView === 'small' ? '🔍 HD' : '🔎 Normal'}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
              {inCollection ? (
                <div className="card-base">
                  <p className="text-sm text-poke-muted mb-3 text-center">Dans votre collection</p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => dispatch({ type: 'SET_QUANTITY', id: card.id, quantity: qty - 1 })}
                      className="w-10 h-10 rounded-xl bg-poke-border hover:bg-poke-red transition-colors font-bold text-lg"
                    >−</button>
                    <span className="text-2xl font-black w-12 text-center">{qty}</span>
                    <button
                      onClick={() => dispatch({ type: 'ADD_CARD', card })}
                      className="w-10 h-10 rounded-xl bg-poke-border hover:bg-poke-yellow hover:text-black transition-colors font-bold text-lg"
                    >+</button>
                  </div>
                  <p className="text-xs text-poke-muted text-center mt-2">
                    Valeur : {avgPrice ? (avgPrice * qty).toFixed(2) + ' €' : '—'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => dispatch({ type: 'ADD_CARD', card })}
                  className="btn-primary justify-center py-4 text-base"
                >
                  📦 Ajouter à la collection
                </button>
              )}

              <button
                onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', card })}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl border font-semibold transition-all duration-200 ${
                  inWishlist
                    ? 'border-poke-red bg-poke-red/10 text-poke-red hover:bg-poke-red/20'
                    : 'border-poke-border text-poke-muted hover:border-poke-red hover:text-poke-red'
                }`}
              >
                {inWishlist ? '❤️ Dans la wishlist' : '🤍 Ajouter à la wishlist'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Name & set */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {card.types?.map(t => (
                  <span key={t} className={`badge border px-3 py-1 ${getTypeClass(t)}`}>{t}</span>
                ))}
                {card.rarity && (
                  <span className="badge bg-poke-card border border-poke-border text-poke-muted">{card.rarity}</span>
                )}
              </div>
              <h1 className="text-4xl font-black mb-1">{card.name}</h1>
              <div className="flex items-center gap-3 text-poke-muted">
                {card.set?.images?.symbol && (
                  <img src={card.set.images.symbol} alt="" className="h-5 w-auto brightness-50"/>
                )}
                <span>{card.set?.name}</span>
                <span>·</span>
                <span>#{card.number}/{card.set?.printedTotal || card.set?.total}</span>
                {card.set?.releaseDate && (
                  <><span>·</span><span>{card.set.releaseDate}</span></>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="card-base">
              <h3 className="font-bold mb-3">Informations</h3>
              <StatLine label="HP" value={card.hp} />
              <StatLine label="Artiste" value={card.artist} />
              <StatLine label="Régulation" value={card.regulationMark} />
              <StatLine label="Numéro national" value={card.nationalPokedexNumbers?.join(', ')} />
              <StatLine label="Supertype" value={card.supertype} />
              <StatLine label="Sous-type" value={card.subtypes?.join(', ')} />
            </div>

            {/* Attacks */}
            {card.attacks?.length > 0 && (
              <div className="card-base">
                <h3 className="font-bold mb-3">Attaques</h3>
                <div className="space-y-4">
                  {card.attacks.map((atk, i) => (
                    <div key={i} className="border-b border-poke-border/50 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{atk.name}</span>
                        {atk.damage && <span className="text-poke-yellow font-bold">{atk.damage}</span>}
                      </div>
                      {atk.cost?.length > 0 && (
                        <div className="text-xs text-poke-muted mb-1">Coût : {atk.cost.join(', ')}</div>
                      )}
                      {atk.text && <p className="text-sm text-poke-muted">{atk.text}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abilities */}
            {card.abilities?.length > 0 && (
              <div className="card-base">
                <h3 className="font-bold mb-3">Capacités</h3>
                <div className="space-y-3">
                  {card.abilities.map((ab, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge bg-purple-900/30 text-purple-300 border border-purple-700/30 text-xs">{ab.type}</span>
                        <span className="font-semibold">{ab.name}</span>
                      </div>
                      {ab.text && <p className="text-sm text-poke-muted">{ab.text}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses / Resistances */}
            {(card.weaknesses?.length > 0 || card.resistances?.length > 0 || card.retreatCost?.length > 0) && (
              <div className="card-base">
                <h3 className="font-bold mb-3">Combat</h3>
                {card.weaknesses?.length > 0 && (
                  <div className="flex items-center gap-3 py-2 border-b border-poke-border/50">
                    <span className="text-sm text-poke-muted w-24">Faiblesse</span>
                    <div className="flex gap-2">
                      {card.weaknesses.map(w => (
                        <span key={w.type} className={`badge border ${getTypeClass(w.type)}`}>{w.type} {w.value}</span>
                      ))}
                    </div>
                  </div>
                )}
                {card.resistances?.length > 0 && (
                  <div className="flex items-center gap-3 py-2 border-b border-poke-border/50">
                    <span className="text-sm text-poke-muted w-24">Résistance</span>
                    <div className="flex gap-2">
                      {card.resistances.map(r => (
                        <span key={r.type} className={`badge border ${getTypeClass(r.type)}`}>{r.type} {r.value}</span>
                      ))}
                    </div>
                  </div>
                )}
                {card.retreatCost?.length > 0 && (
                  <div className="flex items-center gap-3 py-2">
                    <span className="text-sm text-poke-muted w-24">Retraite</span>
                    <span className="text-sm">{card.retreatCost.length} ⬡</span>
                  </div>
                )}
              </div>
            )}

            {/* Prices */}
            {(cmPrices || tcgPrices) && (
              <div className="card-base">
                <h3 className="font-bold mb-3">Prix du marché</h3>
                {cmPrices && (
                  <>
                    <p className="text-xs text-poke-muted uppercase tracking-wider mb-2">CardMarket</p>
                    <PriceTag label="Prix moyen de vente" value={cmPrices.averageSellPrice} highlight />
                    <PriceTag label="Prix moyen (30j)" value={cmPrices.avg30} />
                    <PriceTag label="Prix bas" value={cmPrices.lowPrice} />
                    <PriceTag label="Prix tendance" value={cmPrices.trendPrice} />
                  </>
                )}
                {tcgPrices && Object.entries(tcgPrices).map(([variant, p]) => (
                  p?.market && (
                    <PriceTag key={variant} label={`TCGPlayer (${variant})`} value={p.market} />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
