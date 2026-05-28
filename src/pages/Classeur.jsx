import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'
import EmptyState from '../components/EmptyState'

const CARDS_PER_PAGE = 12
const COLS = 3
const ROWS = 4

function FlipCard({ card, onRemove, onRename }) {
  const [flipped, setFlipped] = useState(false)
  const [editing, setEditing] = useState(false)
  const [nameVal, setNameVal] = useState(card.name)

  function handleRename(e) {
    e.stopPropagation()
    if (nameVal.trim()) onRename(card.id, nameVal.trim())
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Card flip */}
      <div
        className="relative cursor-pointer group"
        style={{ perspective: '800px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            aspectRatio: `${63 / 88}`,
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-poke-border group-hover:border-poke-yellow/50 transition-colors"
          >
            {card.frontImage ? (
              <img
                src={card.frontImage}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-poke-card flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-10 h-10 opacity-20">
                  <circle cx="50" cy="50" r="45" fill="#CC0000"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
                  <rect x="5" y="44" width="90" height="12" fill="#fff"/>
                  <circle cx="50" cy="50" r="14" fill="#fff"/>
                  <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
                </svg>
              </div>
            )}

            {/* Flip hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="text-white text-xs bg-black/60 px-2 py-1 rounded-lg font-medium">
                🔄 Voir verso
              </span>
            </div>
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-poke-border"
          >
            {card.backImage ? (
              <img
                src={card.backImage}
                alt={`${card.name} - verso`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-poke-card flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">🔵</div>
                <p className="text-xs text-poke-muted">Pas de verso</p>
              </div>
            )}

            {/* Flip back hint */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs bg-black/70 px-2 py-0.5 rounded-lg">
                🔄 Recto
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card name + actions */}
      <div className="flex items-center gap-1">
        {editing ? (
          <input
            autoFocus
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(e) }}
            className="flex-1 bg-poke-card border border-poke-yellow rounded-lg px-2 py-0.5 text-xs focus:outline-none min-w-0"
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex-1 text-left text-xs text-poke-muted hover:text-white transition-colors truncate"
            title={card.name}
          >
            {card.name}
          </button>
        )}
        <button
          onClick={() => onRemove(card.id)}
          className="w-5 h-5 flex items-center justify-center rounded text-poke-muted hover:text-poke-red hover:bg-poke-red/10 transition-all flex-shrink-0"
          title="Supprimer"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

function EmptySlot({ index }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="rounded-xl border border-dashed border-poke-border/50 bg-poke-card/30 flex items-center justify-center"
        style={{ aspectRatio: `${63 / 88}` }}
      >
        <span className="text-poke-border/60 text-xl">·</span>
      </div>
      <div className="h-4"/>
    </div>
  )
}

export default function Classeur() {
  const { scannedCards, scannedDispatch } = useCollection()
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(scannedCards.length / CARDS_PER_PAGE))
  const pageCards = scannedCards.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE)
  const filledSlots = [...pageCards]
  while (filledSlots.length < CARDS_PER_PAGE) filledSlots.push(null)

  if (scannedCards.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="section-title">Classeur</h1>
            <Link to="/scan" className="btn-primary text-sm py-2">
              📸 Scanner une carte
            </Link>
          </div>
          <EmptyState
            icon="📒"
            title="Classeur vide"
            description="Scannez vos cartes physiques pour les retrouver ici, rangées comme dans un vrai classeur."
            action="/scan"
            actionLabel="📸 Scanner une carte"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-1">Classeur</h1>
            <p className="text-poke-muted text-sm">
              {scannedCards.length} carte{scannedCards.length > 1 ? 's' : ''} scannée{scannedCards.length > 1 ? 's' : ''}
              · Page {currentPage + 1} / {totalPages}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/scan" className="btn-primary text-sm py-2">
              + Scanner
            </Link>
          </div>
        </div>

        {/* Binder page */}
        <div className="relative">
          {/* Page shadow / binder effect */}
          <div className="bg-poke-card border border-poke-border rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Binding spine */}
            <div className="flex">
              <div className="w-8 bg-gradient-to-b from-poke-border to-poke-dark/80 flex flex-col items-center justify-around py-6 gap-3 flex-shrink-0">
                {Array.from({ length: ROWS }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-poke-border/80"/>
                ))}
              </div>

              {/* Cards grid */}
              <div className="flex-1 p-6">
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
                >
                  {filledSlots.map((card, i) =>
                    card ? (
                      <FlipCard
                        key={card.id}
                        card={card}
                        onRemove={id => scannedDispatch({ type: 'REMOVE_SCANNED', id })}
                        onRename={(id, name) => scannedDispatch({ type: 'UPDATE_SCANNED_NAME', id, name })}
                      />
                    ) : (
                      <EmptySlot key={`empty-${i}`} index={i} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                currentPage === 0
                  ? 'text-poke-muted bg-poke-card/50 cursor-not-allowed'
                  : 'btn-secondary'
              }`}
            >
              ← Page précédente
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentPage ? 'bg-poke-yellow w-6' : 'bg-poke-border hover:bg-poke-muted'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                currentPage === totalPages - 1
                  ? 'text-poke-muted bg-poke-card/50 cursor-not-allowed'
                  : 'btn-secondary'
              }`}
            >
              Page suivante →
            </button>
          </div>
        )}

        <p className="text-center text-xs text-poke-muted mt-4">
          Cliquez sur une carte pour la retourner · Cliquez sur le nom pour le modifier
        </p>
      </div>
    </div>
  )
}
