import { useState, useEffect } from 'react'
import { getProducts } from '@/lib/adminStore'
import type { Product } from '@/types'

/**
 * Reactive hook that reads products from localStorage (admin-managed).
 * Falls back to mock data if localStorage is empty.
 * Re-renders automatically when admin saves product changes.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(getProducts)

  useEffect(() => {
    const handler = () => setProducts(getProducts())
    window.addEventListener('apse:products', handler)
    return () => window.removeEventListener('apse:products', handler)
  }, [])

  return products
}
