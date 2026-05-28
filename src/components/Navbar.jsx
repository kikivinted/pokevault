import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'

export default function Navbar() {
  const { totalCards } = useCollection()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/recherche', label: 'Recherche' },
    { to: '/collection', label: 'Ma Collection' },
    { to: '/stats', label: 'Statistiques' },
    { to: '/wishlist', label: 'Wishlist' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-poke-dark/95 backdrop-blur-md border-b border-poke-border shadow-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                <circle cx="50" cy="50" r="45" fill="#CC0000"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6"/>
                <rect x="5" y="44" width="90" height="12" fill="#fff"/>
                <circle cx="50" cy="50" r="14" fill="#fff"/>
                <circle cx="50" cy="50" r="9" fill="#0a0a0f"/>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">
              Poké<span className="text-poke-yellow">Vault</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-poke-yellow/10 text-poke-yellow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/collection"
              className="hidden sm:flex items-center gap-2 bg-poke-card border border-poke-border px-3 py-1.5 rounded-lg text-sm hover:border-poke-yellow transition-colors"
            >
              <span className="text-poke-muted">Collection</span>
              <span className="bg-poke-yellow text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {totalCards}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-poke-card transition-colors"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
                <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
                <span className={`block h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-poke-border animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all ${
                    isActive ? 'bg-poke-yellow/10 text-poke-yellow' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
