import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-poke-border mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <circle cx="50" cy="50" r="45" fill="#CC0000"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
                <rect x="5" y="44" width="90" height="12" fill="#fff"/>
                <circle cx="50" cy="50" r="14" fill="#fff"/>
                <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
              </svg>
              <span className="text-lg font-black">Poké<span className="text-poke-yellow">Vault</span></span>
            </div>
            <p className="text-poke-muted text-sm">
              Gérez, suivez et valorisez votre collection de cartes Pokémon en toute simplicité.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-poke-muted">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/recherche', label: 'Recherche de cartes' },
                { to: '/collection', label: 'Ma Collection' },
                { to: '/stats', label: 'Statistiques' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-poke-muted hover:text-poke-yellow transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-poke-muted">Info</h4>
            <ul className="space-y-2 text-sm text-poke-muted">
              <li>Données : Pokémon TCG API</li>
              <li>Collection sauvegardée en local</li>
              <li>Mise à jour des prix en temps réel</li>
              <li className="pt-2 text-xs">Pokémon © Nintendo / Game Freak</li>
              <li className="text-xs">PokéVault n'est pas affilié à Nintendo</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-poke-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-poke-muted text-sm">© 2024 PokéVault. Tous droits réservés.</p>
          <div className="flex items-center gap-1 text-sm text-poke-muted">
            <span>Fait avec</span>
            <span className="text-poke-red">♥</span>
            <span>pour les dresseurs</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
