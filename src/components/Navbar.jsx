import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext'
import { useLang } from '../context/LanguageContext'
import SearchOverlay from './SearchOverlay'

export default function Navbar() {
  const { scannedCards } = useCollection()
  const { currentLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/series', label: 'Séries' },
    { to: '/scan', label: 'Scan' },
    { to: '/classeur', label: 'Classeur' },
    { to: '/marche', label: 'Marché' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-poke-dark/95 backdrop-blur-md border-b border-poke-border shadow-xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9">
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
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-poke-border text-poke-muted hover:text-white hover:border-poke-yellow transition-all duration-200"
                title="Rechercher (⌘K)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span className="hidden sm:block text-xs">⌘K</span>
              </button>

              {/* Language indicator */}
              <Link
                to="/parametres"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-poke-border text-poke-muted hover:border-poke-yellow hover:text-white transition-all"
                title="Paramètres"
              >
                <span className="text-base">{currentLang.flag}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </Link>

              {/* Classeur count */}
              {scannedCards.length > 0 && (
                <Link
                  to="/classeur"
                  className="hidden lg:flex items-center gap-1.5 bg-poke-card border border-poke-border px-3 py-1.5 rounded-lg text-sm hover:border-poke-yellow transition-colors"
                >
                  <span className="text-poke-muted text-xs">Classeur</span>
                  <span className="bg-poke-yellow text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {scannedCards.length}
                  </span>
                </Link>
              )}

              {/* Mobile menu */}
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
              <button
                onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Rechercher
              </button>
              <Link
                to="/parametres"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5"
              >
                ⚙️ Paramètres — {currentLang.flag} {currentLang.label}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
