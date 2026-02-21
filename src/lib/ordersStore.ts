import type { CartItem } from '@/types'

export const REAL_ORDERS_KEY = 'apse_real_orders'

export interface RealOrder {
  id: string
  customer: string
  email: string
  phone: string
  date: string            // ISO YYYY-MM-DD
  address: string
  city: string
  state: string
  pincode: string
  country: string
  paymentMethod: string
  items: Array<{ name: string; price: number; quantity: number; image: string; mode: string }>
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export function getRealOrders(): RealOrder[] {
  try {
    const raw = localStorage.getItem(REAL_ORDERS_KEY)
    return raw ? (JSON.parse(raw) as RealOrder[]) : []
  } catch {
    return []
  }
}

export function saveRealOrder(order: RealOrder) {
  const orders = getRealOrders()
  orders.unshift(order) // newest first
  localStorage.setItem(REAL_ORDERS_KEY, JSON.stringify(orders))
  window.dispatchEvent(new Event('apse:orders'))
}

export function updateRealOrderStatus(id: string, status: RealOrder['status']) {
  const orders = getRealOrders().map(o => o.id === id ? { ...o, status } : o)
  localStorage.setItem(REAL_ORDERS_KEY, JSON.stringify(orders))
  window.dispatchEvent(new Event('apse:orders'))
}

/** Build a RealOrder from checkout form data + cart items */
export function buildOrder(params: {
  orderId: string
  shippingData: {
    firstName: string; lastName: string; email: string; phone: string
    address: string; city: string; state: string; pincode: string; country: string
  }
  paymentMethod: string
  cartItems: CartItem[]
  subtotal: number
  shipping: number
  grandTotal: number
}): RealOrder {
  const { orderId, shippingData, paymentMethod, cartItems, subtotal, shipping, grandTotal } = params
  return {
    id: orderId,
    customer: `${shippingData.firstName} ${shippingData.lastName}`,
    email: shippingData.email,
    phone: shippingData.phone,
    date: new Date().toISOString().slice(0, 10),
    address: shippingData.address,
    city: shippingData.city,
    state: shippingData.state,
    pincode: shippingData.pincode,
    country: shippingData.country,
    paymentMethod,
    items: cartItems.map(({ product, quantity, mode }) => ({
      name: product.name,
      price: mode === 'wholesale' && product.wholesalePrice ? product.wholesalePrice : product.price,
      quantity,
      image: product.image,
      mode,
    })),
    subtotal,
    shipping,
    total: grandTotal,
    status: 'pending',
  }
}
