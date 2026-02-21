import { PRODUCTS } from '@/data/mockData'
import type { Product } from '@/types'

// ─── Keys ─────────────────────────────────────────────────────────────────────
export const PRODUCTS_KEY = 'apse_products'
export const ADMIN_AUTH_KEY = 'apse_admin_auth'
export const ORDERS_KEY = 'apse_orders'

// ─── Admin Credentials ────────────────────────────────────────────────────────
export const ADMIN_EMAIL = 'admin@apse.com'
export const ADMIN_PASSWORD = 'Admin@123'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Order {
  id: string
  customer: string
  email: string
  phone: string
  date: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  address: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  joinedAt: string
  orders: number
  totalSpent: number
  city: string
}

export interface QuoteEntry {
  id: string
  name: string
  email: string
  phone: string
  company: string
  products: string
  quantity: string
  trade: string
  deliveryLocation: string
  date: string
  status: 'new' | 'reviewing' | 'quoted' | 'closed'
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_AUTH_KEY, '1')
    return true
  }
  return false
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_AUTH_KEY)
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_AUTH_KEY) === '1'
}

// ─── Products CRUD ────────────────────────────────────────────────────────────
export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (raw) return JSON.parse(raw) as Product[]
  } catch {}
  return PRODUCTS
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  window.dispatchEvent(new Event('apse:products'))
}

export function addProduct(p: Product) {
  const list = getProducts()
  saveProducts([...list, p])
}

export function updateProduct(updated: Product) {
  const list = getProducts().map(p => (p.id === updated.id ? updated : p))
  saveProducts(list)
}

export function deleteProduct(id: string) {
  saveProducts(getProducts().filter(p => p.id !== id))
}

// ─── Mock Orders ──────────────────────────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  { id: 'APE-MC4X2', customer: 'Rahul Sharma', email: 'rahul@email.com', phone: '9876543210', date: '2026-02-18', items: 3, total: 21800, status: 'delivered', paymentMethod: 'UPI', address: 'B-42, Sector 15, Noida, UP' },
  { id: 'APE-LC9K1', customer: 'Priya Patel', email: 'priya@email.com', phone: '9123456780', date: '2026-02-19', items: 1, total: 134900, status: 'shipped', paymentMethod: 'Card', address: '301, Marine Lines, Mumbai, MH' },
  { id: 'APE-TR7Q8', customer: 'Anil Mehta', email: 'anil@email.com', phone: '9988776655', date: '2026-02-20', items: 2, total: 28899, status: 'delivered', paymentMethod: 'COD', address: 'C-7, JP Nagar, Bengaluru, KA' },
  { id: 'APE-ZB3R5', customer: 'Sneha Iyer', email: 'sneha@email.com', phone: '9012345678', date: '2026-02-20', items: 4, total: 52400, status: 'processing', paymentMethod: 'UPI', address: '12, T Nagar, Chennai, TN' },
  { id: 'APE-WD8P1', customer: 'Vikram Singh', email: 'vikram@email.com', phone: '9871234560', date: '2026-02-21', items: 1, total: 89999, status: 'pending', paymentMethod: 'Card', address: '5A, Salt Lake, Kolkata, WB' },
  { id: 'APE-QN2X7', customer: 'Deepa Nair', email: 'deepa@email.com', phone: '9856741230', date: '2026-02-21', items: 2, total: 16598, status: 'pending', paymentMethod: 'COD', address: '8, MG Road, Kochi, KL' },
  { id: 'APE-HL5F4', customer: 'Mohan Das', email: 'mohan@email.com', phone: '9765432109', date: '2026-02-17', items: 5, total: 44995, status: 'delivered', paymentMethod: 'UPI', address: '22, Ring Road, Hyderabad, TS' },
  { id: 'APE-KP6Y3', customer: 'Kavita Reddy', email: 'kavita@email.com', phone: '9654321098', date: '2026-02-16', items: 1, total: 12999, status: 'cancelled', paymentMethod: 'Card', address: '9, Jubilee Hills, Hyderabad, TS' },
]

// ─── Mock Customers ───────────────────────────────────────────────────────────
export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'U001', name: 'Rahul Sharma', email: 'rahul@email.com', phone: '9876543210', joinedAt: '2025-10-12', orders: 5, totalSpent: 68400, city: 'Noida' },
  { id: 'U002', name: 'Priya Patel', email: 'priya@email.com', phone: '9123456780', joinedAt: '2025-11-03', orders: 2, totalSpent: 147800, city: 'Mumbai' },
  { id: 'U003', name: 'Anil Mehta', email: 'anil@email.com', phone: '9988776655', joinedAt: '2025-09-21', orders: 8, totalSpent: 95600, city: 'Bengaluru' },
  { id: 'U004', name: 'Sneha Iyer', email: 'sneha@email.com', phone: '9012345678', joinedAt: '2026-01-05', orders: 3, totalSpent: 52400, city: 'Chennai' },
  { id: 'U005', name: 'Vikram Singh', email: 'vikram@email.com', phone: '9871234560', joinedAt: '2026-02-01', orders: 1, totalSpent: 89999, city: 'Kolkata' },
  { id: 'U006', name: 'Deepa Nair', email: 'deepa@email.com', phone: '9856741230', joinedAt: '2025-12-18', orders: 4, totalSpent: 31200, city: 'Kochi' },
  { id: 'U007', name: 'Mohan Das', email: 'mohan@email.com', phone: '9765432109', joinedAt: '2025-08-30', orders: 12, totalSpent: 220000, city: 'Hyderabad' },
  { id: 'U008', name: 'Kavita Reddy', email: 'kavita@email.com', phone: '9654321098', joinedAt: '2026-01-22', orders: 1, totalSpent: 12999, city: 'Hyderabad' },
]

// ─── Mock Quote Requests ──────────────────────────────────────────────────────
export const MOCK_QUOTES: QuoteEntry[] = [
  { id: 'Q001', name: 'Rajan Exports', email: 'rajan@exports.com', phone: '9800012345', company: 'Rajan Exports Pvt Ltd', products: 'Canon R100 Camera x50 units', quantity: '50', trade: 'Export', deliveryLocation: 'Dubai, UAE', date: '2026-02-19', status: 'reviewing' },
  { id: 'Q002', name: 'Metro Retailers', email: 'buy@metro.in', phone: '9811122334', company: 'Metro Retailers Ltd', products: 'Samsung S24 Ultra 512GB x20', quantity: '20', trade: 'Wholesale', deliveryLocation: 'Delhi NCR', date: '2026-02-20', status: 'quoted' },
  { id: 'Q003', name: 'Gulf Traders LLC', email: 'info@gulftraders.ae', phone: '+97150xxxxxx', company: 'Gulf Traders LLC', products: 'Sony Alpha cameras, Mixed lot', quantity: '100+', trade: 'Export', deliveryLocation: 'Abu Dhabi, UAE', date: '2026-02-21', status: 'new' },
  { id: 'Q004', name: 'ShopBig India', email: 'procurement@shopbig.in', phone: '9922334455', company: 'ShopBig India', products: 'Prestige Induction Cooktops x200', quantity: '200', trade: 'Wholesale', deliveryLocation: 'Pan India', date: '2026-02-21', status: 'new' },
  { id: 'Q005', name: 'Euro Fashion Group', email: 'eu@fashion.com', phone: '+49xxxxxxxxx', company: 'Euro Fashion Group GmbH', products: "Men's & Women's Garments mixed", quantity: '500 pcs', trade: 'Export', deliveryLocation: 'Germany', date: '2026-02-17', status: 'closed' },
]
