import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto opacity-30 animate-spin-slow">
            <circle cx="50" cy="50" r="45" fill="#CC0000"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
            <rect x="5" y="44" width="90" height="12" fill="#fff"/>
            <circle cx="50" cy="50" r="14" fill="#fff"/>
            <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
          </svg>
        </div>
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-xl text-poke-muted mb-8">Cette page n'existe pas dans le Pokédex.</p>
        <Link to="/" className="btn-primary">← Retour à l'accueil</Link>
      </div>
    </div>
  )
}
