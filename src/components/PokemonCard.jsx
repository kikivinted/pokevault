import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'

function getTypeClass(type) {
  const map = {
    Fire: 'type-fire', Water: 'type-water', Grass: 'type-grass',
    Lightning: 'type-lightning', Psychic: 'type-psychic', Fighting: 'type-fighting',
    Darkness: 'type-darkness', Metal: 'type-metal', Dragon: 'type-dragon',
    Colorless: 'type-colorless', Fairy: 'type-fairy',
  }
  return map[type] || 'type-default'
}

function getRarityClass(rarity = '') {
  if (!rarity) return 'rarity-common'
  const r = rarity.toLowerCase()
  if (r.includes('secret')) return 'rarity-secret'
  if (r.includes('ultra') || r.includes('amazing') || r.includes('rainbow')) return 'rarity-ultra'
  if (r.includes('holo') || r.includes('v ') || r.includes('vmax') || r.includes('vstar')) return 'rarity-holo'
  if (r.includes('rare')) return 'rarity-rare'
  if (r.includes('uncommon')) return 'rarity-uncommon'
  if (r.includes('promo')) return 'rarity-promo'
  return 'rarity-common'
}

function getPrice(card) {
  return card.cardmarket?.prices?.averageSellPrice
    || card.tcgplayer?.prices?.holofoil?.market
    || card.tcgplayer?.prices?.normal?.market
    || null
}

export default function PokemonCard({ card, showActions = true }) {
  const { dispatch, isInCollection, isInWishlist, getQuantity } = useCollection()
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)

  const inCollection = isInCollection(card.id)
  const inWishlist = isInWishlist(card.id)
  const qty = getQuantity(card.id)
  const price = getPrice(card)

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    dispatch({ type: 'ADD_CARD', card })
    setTimeout(() => setAdding(false), 600)
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'TOGGLE_WISHLIST', card })
  }

  function handleQty(e, delta) {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'SET_QUANTITY', id: card.id, quantity: qty + delta })
  }

  const imgSrc = card.images?.small || card.images?.large
  const types = card.types || []

  return (
    <div className="pokemon-card-wrap group relative">
      <Link to={`/carte/${card.id}`} className="block">
        <div className="pokemon-card-inner bg-poke-card border border-poke-border rounded-2xl overflow-hidden hover:border-poke-yellow/60 hover:shadow-lg hover:shadow-poke-yellow/10">
          {/* Image */}
          <div className="relative aspect-[2/3] bg-gradient-to-br from-poke-border/30 to-poke-dark overflow-hidden">
            {imgSrc && !imgError ? (
              <img
                src={imgSrc}
                alt={card.name}
                className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-20">
                  <circle cx="50" cy="50" r="45" fill="#CC0000"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
                  <rect x="5" y="44" width="90" height="12" fill="#fff"/>
                  <circle cx="50" cy="50" r="14" fill="#fff"/>
                  <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
                </svg>
              </div>
            )}

            {/* Collection badge */}
            {inCollection && (
              <div className="absolute top-2 left-2 bg-poke-yellow text-black text-xs font-bold px-2 py-0.5 rounded-full">
                ×{qty}
              </div>
            )}

            {/* Wishlist button */}
            {showActions && (
              <button
                onClick={handleWishlist}
                className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${
                  inWishlist
                    ? 'bg-poke-red text-white'
                    : 'bg-black/50 text-gray-400 hover:text-poke-red opacity-0 group-hover:opacity-100'
                }`}
              >
                <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-bold text-sm truncate mb-1">{card.name}</h3>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-poke-muted truncate">{card.set?.name}</span>
              {card.rarity && (
                <span className={`text-xs font-medium ${getRarityClass(card.rarity)}`}>
                  {card.rarity}
                </span>
              )}
            </div>

            {types.length > 0 && (
              <div className="flex gap-1 mb-2 flex-wrap">
                {types.slice(0, 2).map(t => (
                  <span key={t} className={`badge border text-xs ${getTypeClass(t)}`}>{t}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-poke-yellow">
                {price ? `${price.toFixed(2)} €` : '—'}
              </span>

              {showActions && (
                inCollection ? (
                  <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
                    <button
                      onClick={e => handleQty(e, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-poke-border hover:bg-poke-red transition-colors text-xs font-bold"
                    >−</button>
                    <span className="w-5 text-center text-xs font-bold">{qty}</span>
                    <button
                      onClick={e => handleQty(e, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-poke-border hover:bg-poke-yellow hover:text-black transition-colors text-xs font-bold"
                    >+</button>
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all duration-200 ${
                      adding
                        ? 'bg-green-600 text-white scale-95'
                        : 'bg-poke-yellow/10 text-poke-yellow hover:bg-poke-yellow hover:text-black'
                    }`}
                  >
                    {adding ? '✓' : '+ Ajouter'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
