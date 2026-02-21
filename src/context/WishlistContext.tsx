import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product } from '@/types'

// ─── State ───────────────────────────────────────────────────────────────────

interface WishlistState {
  items: Product[]
}

type WishlistAction =
  | { type: 'TOGGLE'; payload: Product }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' }

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.some(i => i.id === action.payload.id)
      return {
        items: exists
          ? state.items.filter(i => i.id !== action.payload.id)
          : [...state.items, action.payload],
      }
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.payload) }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface WishlistContextValue extends WishlistState {
  toggle: (product: Product) => void
  remove: (id: string) => void
  clearWishlist: () => void
  isWished: (id: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

const STORAGE_KEY = 'apse_wishlist'

function loadFromStorage(): WishlistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as WishlistState
  } catch { /* ignore */ }
  return { items: [] }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value: WishlistContextValue = {
    ...state,
    count: state.items.length,
    toggle: (product) => dispatch({ type: 'TOGGLE', payload: product }),
    remove: (id) => dispatch({ type: 'REMOVE', payload: id }),
    clearWishlist: () => dispatch({ type: 'CLEAR' }),
    isWished: (id) => state.items.some(i => i.id === id),
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
