import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'
import EmptyState from '../components/EmptyState'

function getPrice(card) {
  return card.cardmarket?.prices?.averageSellPrice
    || card.tcgplayer?.prices?.holofoil?.market
    || card.tcgplayer?.prices?.normal?.market
    || 0
}

function getTypeClass(type) {
  const map = {
    Fire: 'type-fire', Water: 'type-water', Grass: 'type-grass',
    Lightning: 'type-lightning', Psychic: 'type-psychic', Fighting: 'type-fighting',
    Darkness: 'type-darkness', Metal: 'type-metal', Dragon: 'type-dragon',
    Colorless: 'type-colorless', Fairy: 'type-fairy',
  }
  return map[type] || 'type-default'
}

function CollectionRow({ card, onRemove, onQtyChange }) {
  const price = getPrice(card)
  const total = price * card.quantity

  return (
    <div className="card-base flex items-center gap-4 hover:border-poke-yellow/30 transition-all animate-fade-in">
      {/* Image */}
      <Link to={`/carte/${card.id}`} className="flex-shrink-0">
        <img
          src={card.images?.small}
          alt={card.name}
          className="h-20 w-14 object-contain rounded-lg hover:scale-105 transition-transform"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Link to={`/carte/${card.id}`} className="font-bold hover:text-poke-yellow transition-colors truncate">
            {card.name}
          </Link>
          {card.types?.slice(0, 2).map(t => (
            <span key={t} className={`badge border text-xs ${getTypeClass(t)}`}>{t}</span>
          ))}
        </div>
        <p className="text-sm text-poke-muted truncate">
          {card.set?.name} · #{card.number}
          {card.rarity && ` · ${card.rarity}`}
        </p>
      </div>

      {/* Price */}
      <div className="text-right hidden sm:block flex-shrink-0">
        <div className="text-sm text-poke-muted">Unitaire</div>
        <div className="font-semibold text-sm">{price ? `${price.toFixed(2)} €` : '—'}</div>
      </div>

      {/* Qty control */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onQtyChange(card.id, card.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-poke-border hover:bg-poke-red transition-colors text-sm font-bold"
        >−</button>
        <span className="w-6 text-center font-bold">{card.quantity}</span>
        <button
          onClick={() => onQtyChange(card.id, card.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-poke-border hover:bg-poke-yellow hover:text-black transition-colors text-sm font-bold"
        >+</button>
      </div>

      {/* Total */}
      <div className="text-right hidden md:block flex-shrink-0 w-20">
        <div className="text-xs text-poke-muted">Total</div>
        <div className="font-bold text-poke-yellow">{total ? `${total.toFixed(2)} €` : '—'}</div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(card.id)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-poke-muted hover:text-poke-red hover:bg-poke-red/10 transition-all"
        title="Supprimer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  )
}

export default function Collection() {
  const { cards, dispatch, totalCards, totalValue, uniqueCards } = useCollection()
  const [sortBy, setSortBy] = useState('addedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const allTypes = useMemo(() => {
    const types = new Set()
    cards.forEach(c => c.types?.forEach(t => types.add(t)))
    return [...types].sort()
  }, [cards])

  const sorted = useMemo(() => {
    let list = [...cards]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.set?.name?.toLowerCase().includes(q))
    }
    if (typeFilter) {
      list = list.filter(c => c.types?.includes(typeFilter))
    }

    list.sort((a, b) => {
      let va, vb
      if (sortBy === 'name') { va = a.name; vb = b.name }
      else if (sortBy === 'price') { va = getPrice(a); vb = getPrice(b) }
      else if (sortBy === 'quantity') { va = a.quantity; vb = b.quantity }
      else if (sortBy === 'value') { va = getPrice(a) * a.quantity; vb = getPrice(b) * b.quantity }
      else { va = a.addedAt || 0; vb = b.addedAt || 0 }

      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })

    return list
  }, [cards, search, typeFilter, sortBy, sortDir])

  function toggleSort(key) {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('desc') }
  }

  function SortBtn({ label, field }) {
    const active = sortBy === field
    return (
      <button
        onClick={() => toggleSort(field)}
        className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
          active ? 'bg-poke-yellow text-black font-bold' : 'bg-poke-card border border-poke-border text-poke-muted hover:text-white'
        }`}
      >
        {label} {active && (sortDir === 'asc' ? '↑' : '↓')}
      </button>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title mb-2">Ma Collection</h1>
          <EmptyState
            icon="📦"
            title="Votre collection est vide"
            description="Recherchez des cartes et ajoutez-les à votre collection pour commencer."
            action="/recherche"
            actionLabel="🔍 Chercher des cartes"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-1">Ma Collection</h1>
            <p className="text-poke-muted text-sm">
              {uniqueCards} cartes uniques · {totalCards} exemplaires · {totalValue.toFixed(2)} €
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/recherche" className="btn-primary text-sm py-2">
              + Ajouter des cartes
            </Link>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-poke-red">Confirmer ?</span>
                <button onClick={() => { dispatch({ type: 'CLEAR_COLLECTION' }); setConfirmClear(false) }} className="btn-danger text-sm py-1.5">Oui</button>
                <button onClick={() => setConfirmClear(false)} className="btn-secondary text-sm py-1.5">Non</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="btn-secondary text-sm py-2 text-poke-red border-poke-red/30 hover:border-poke-red">
                Vider
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-base text-center">
            <div className="text-2xl font-black text-poke-yellow">{uniqueCards}</div>
            <div className="text-xs text-poke-muted mt-1">Uniques</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-black text-poke-yellow">{totalCards}</div>
            <div className="text-xs text-poke-muted mt-1">Exemplaires</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-black text-poke-yellow">{totalValue.toFixed(0)} €</div>
            <div className="text-xs text-poke-muted mt-1">Valeur</div>
          </div>
        </div>

        {/* Filters & sort */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrer par nom..."
            className="bg-poke-card border border-poke-border rounded-xl px-4 py-2 text-sm text-white placeholder-poke-muted focus:outline-none focus:border-poke-yellow transition-colors"
          />

          {allTypes.length > 0 && (
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-poke-card border border-poke-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-poke-yellow transition-colors"
            >
              <option value="">Tous les types</option>
              {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-poke-muted">Trier :</span>
            <SortBtn label="Date" field="addedAt" />
            <SortBtn label="Nom" field="name" />
            <SortBtn label="Prix" field="price" />
            <SortBtn label="Qté" field="quantity" />
            <SortBtn label="Valeur" field="value" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {sorted.length === 0 ? (
            <p className="text-center text-poke-muted py-10">Aucune carte ne correspond aux filtres.</p>
          ) : (
            sorted.map(card => (
              <CollectionRow
                key={card.id}
                card={card}
                onRemove={id => dispatch({ type: 'REMOVE_CARD', id })}
                onQtyChange={(id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity })}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
