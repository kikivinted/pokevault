import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyState({ title, description, action, actionLabel, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-6">{icon || '🃏'}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-poke-muted max-w-sm mb-6">{description}</p>
      {action && (
        <Link to={action} className="btn-primary">
          {actionLabel || 'Commencer'}
        </Link>
      )}
    </div>
  )
}
