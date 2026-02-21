// ─── Product & Category Types ───────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  image: string
  images?: string[]
  price: number
  originalPrice?: number
  discount?: number
  category: string
  categorySlug: string
  rating: number
  reviews: number
  isNew?: boolean
  isFeatured?: boolean
  isBestSeller?: boolean
  isTopRated?: boolean
  stock: number
  description: string
  specs?: Record<string, string>
  moq?: number           // minimum order quantity (wholesale)
  wholesalePrice?: number
  condition?: 'new' | 'pre-owned' | 'refurbished'
  tags?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  productCount?: number
  parent?: string
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
  mode: 'retail' | 'wholesale'
}

export interface CartState {
  items: CartItem[]
  total: number
  count: number
}

// ─── Quote Types ─────────────────────────────────────────────────────────────

export interface QuoteRequest {
  id?: string
  name: string
  email: string
  phone: string
  company?: string
  trade: string
  products: string
  quantity: string
  deliveryLocation: string
  notes?: string
  createdAt?: string
}

// ─── Service/Pre-owned Types ─────────────────────────────────────────────────

export interface ServiceListing {
  id: string
  title: string
  category: string
  description: string
  price?: number
  image: string
  provider?: string
  tags?: string[]
}

// ─── Export/Import Types ─────────────────────────────────────────────────────

export interface TradeInquiry {
  id?: string
  companyName: string
  contactName: string
  email: string
  phone: string
  country: string
  tradeType: 'export' | 'import'
  commodity: string
  quantity: string
  targetMarket: string
  notes?: string
}

// ─── Navigation Types ────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
