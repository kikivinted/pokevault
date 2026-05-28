import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Rechercher une carte...', autoFocus = false }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus()
  }, [autoFocus])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && onSubmit) onSubmit(value)
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="w-5 h-5 text-poke-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-poke-card border border-poke-border rounded-2xl pl-12 pr-4 py-4 text-white placeholder-poke-muted focus:outline-none focus:border-poke-yellow focus:ring-1 focus:ring-poke-yellow/30 transition-all duration-200 text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-poke-muted hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  )
}

export function QuickSearchBar() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (q.trim()) navigate(`/recherche?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
        <svg className="w-6 h-6 text-poke-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Charizard, Pikachu, Mewtwo..."
        className="w-full bg-poke-card border-2 border-poke-border rounded-2xl pl-14 pr-32 py-5 text-white placeholder-poke-muted focus:outline-none focus:border-poke-yellow transition-all duration-200 text-lg shadow-xl"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <span className="bg-poke-yellow text-black font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors mr-1.5">
          Rechercher
        </span>
      </button>
    </form>
  )
}
