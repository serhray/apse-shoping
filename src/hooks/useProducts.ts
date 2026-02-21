import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import { api } from '@/lib/apiClient'

/**
 * Reactive hook that reads products from localStorage (admin-managed).
 * Falls back to mock data if localStorage is empty.
 * Re-renders automatically when admin saves product changes.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let alive = true
    api.get<Product[]>('/api/products')
      .then(list => {
        if (alive) setProducts(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (alive) setProducts([])
      })
    return () => { alive = false }
  }, [])

  return products
}
