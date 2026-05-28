import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CollectionContext = createContext(null)

const STORAGE_KEY = 'pokevault_collection'

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD': {
      const existing = state.cards.find(c => c.id === action.card.id)
      if (existing) {
        return {
          ...state,
          cards: state.cards.map(c =>
            c.id === action.card.id
              ? { ...c, quantity: c.quantity + 1 }
              : c
          ),
        }
      }
      return { ...state, cards: [...state.cards, { ...action.card, quantity: 1, addedAt: Date.now() }] }
    }
    case 'REMOVE_CARD':
      return { ...state, cards: state.cards.filter(c => c.id !== action.id) }
    case 'SET_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, cards: state.cards.filter(c => c.id !== action.id) }
      }
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.id ? { ...c, quantity: action.quantity } : c
        ),
      }
    }
    case 'TOGGLE_WISHLIST': {
      const existing = state.wishlist.find(c => c.id === action.card.id)
      if (existing) {
        return { ...state, wishlist: state.wishlist.filter(c => c.id !== action.card.id) }
      }
      return { ...state, wishlist: [...state.wishlist, { ...action.card, addedAt: Date.now() }] }
    }
    case 'CLEAR_COLLECTION':
      return { ...state, cards: [] }
    default:
      return state
  }
}

const initialState = { cards: [], wishlist: [] }

export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const isInCollection = (id) => state.cards.some(c => c.id === id)
  const isInWishlist = (id) => state.wishlist.some(c => c.id === id)
  const getQuantity = (id) => state.cards.find(c => c.id === id)?.quantity ?? 0

  const totalCards = state.cards.reduce((sum, c) => sum + c.quantity, 0)
  const totalValue = state.cards.reduce((sum, c) => {
    const price = c.cardmarket?.prices?.averageSellPrice
      || c.tcgplayer?.prices?.holofoil?.market
      || c.tcgplayer?.prices?.normal?.market
      || 0
    return sum + price * c.quantity
  }, 0)
  const uniqueCards = state.cards.length

  return (
    <CollectionContext.Provider value={{
      cards: state.cards,
      wishlist: state.wishlist,
      dispatch,
      isInCollection,
      isInWishlist,
      getQuantity,
      totalCards,
      totalValue,
      uniqueCards,
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}
