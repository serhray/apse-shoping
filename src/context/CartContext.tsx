import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product, CartItem, CartState } from '@/types'

// ─── Actions ─────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; mode: 'retail' | 'wholesale' } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, mode } = action.payload
      const key = `${product.id}-${mode}`
      const existing = state.items.find(i => `${i.product.id}-${i.mode}` === key)
      let items: CartItem[]
      if (existing) {
        items = state.items.map(i =>
          `${i.product.id}-${i.mode}` === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      } else {
        items = [...state.items, { product, quantity, mode }]
      }
      return calcTotals(items)
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.product.id !== action.payload)
      return calcTotals(items)
    }
    case 'UPDATE_QTY': {
      const items = state.items
        .map(i => i.product.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i)
        .filter(i => i.quantity > 0)
      return calcTotals(items)
    }
    case 'CLEAR_CART':
      return { items: [], total: 0, count: 0 }
    default:
      return state
  }
}

function calcTotals(items: CartItem[]): CartState {
  const total = items.reduce((sum, i) => {
    const price = i.mode === 'wholesale' && i.product.wholesalePrice
      ? i.product.wholesalePrice
      : i.product.price
    return sum + price * i.quantity
  }, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  return { items, total, count }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number, mode?: 'retail' | 'wholesale') => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'apse_cart'

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as CartState
  } catch { /* ignore */ }
  return { items: [], total: 0, count: 0 }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = (product: Product, quantity = 1, mode: 'retail' | 'wholesale' = 'retail') =>
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, mode } })

  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })

  const updateQty = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
