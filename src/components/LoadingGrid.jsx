import React from 'react'

export function CardSkeleton() {
  return (
    <div className="bg-poke-card border border-poke-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-poke-border/30"/>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-poke-border rounded w-3/4"/>
        <div className="h-3 bg-poke-border rounded w-1/2"/>
        <div className="h-3 bg-poke-border rounded w-1/3"/>
      </div>
    </div>
  )
}

export default function LoadingGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${s} border-2 border-poke-border border-t-poke-yellow rounded-full animate-spin`}/>
  )
}
