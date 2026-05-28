import React from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'
import EmptyState from '../components/EmptyState'

function getPrice(card) {
  return card.cardmarket?.prices?.averageSellPrice
    || card.tcgplayer?.prices?.holofoil?.market
    || card.tcgplayer?.prices?.normal?.market
    || 0
}

export default function Wishlist() {
  const { wishlist, dispatch, isInCollection } = useCollection()

  const totalWishValue = wishlist.reduce((sum, c) => sum + getPrice(c), 0)

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title mb-2">Wishlist</h1>
          <EmptyState
            icon="🤍"
            title="Votre wishlist est vide"
            description="Cliquez sur le cœur d'une carte pour la sauvegarder dans votre wishlist."
            action="/recherche"
            actionLabel="🔍 Explorer les cartes"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-1">Wishlist</h1>
            <p className="text-poke-muted text-sm">
              {wishlist.length} carte{wishlist.length > 1 ? 's' : ''} · Valeur estimée : {totalWishValue.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlist.map(card => {
            const price = getPrice(card)
            const owned = isInCollection(card.id)
            return (
              <div key={card.id} className="group relative">
                <Link to={`/carte/${card.id}`} className="block">
                  <div className="bg-poke-card border border-poke-border rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
                    <div className="relative aspect-[2/3] bg-poke-border/20">
                      {card.images?.small ? (
                        <img
                          src={card.images.small}
                          alt={card.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🃏</div>
                      )}

                      {owned && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          ✓ Possédée
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="font-bold text-sm truncate mb-1">{card.name}</h3>
                      <p className="text-xs text-poke-muted truncate mb-2">{card.set?.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-poke-yellow">
                          {price ? `${price.toFixed(2)} €` : '—'}
                        </span>
                        <div className="flex items-center gap-1">
                          {!owned && (
                            <button
                              onClick={e => { e.preventDefault(); dispatch({ type: 'ADD_CARD', card }) }}
                              className="text-xs px-2 py-1 bg-poke-yellow/10 text-poke-yellow rounded-lg hover:bg-poke-yellow hover:text-black transition-all font-semibold"
                            >
                              + Avoir
                            </button>
                          )}
                          <button
                            onClick={e => { e.preventDefault(); dispatch({ type: 'TOGGLE_WISHLIST', card }) }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-poke-red/10 text-poke-red hover:bg-poke-red hover:text-white transition-all"
                          >
                            ❤️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
