import { useState, useEffect } from 'react'
import { MOCK_ORDERS } from '@/lib/adminStore'
import type { Order } from '@/lib/adminStore'
import { getRealOrders, updateRealOrderStatus } from '@/lib/ordersStore'
import { Search, Filter } from 'lucide-react'

const ALL_STATUS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const

const STATUS_COLOR: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const PAYMENT_ICON: Record<string, string> = {
  UPI: '📱',
  Card: '💳',
  COD: '💵',
}

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN') }

const PM_MAP: Record<string, string> = { cod: 'COD', upi: 'UPI', card: 'Card' }

function realToOrder(r: ReturnType<typeof getRealOrders>[0]): Order {
  return {
    id: r.id,
    customer: r.customer,
    email: r.email,
    phone: r.phone ?? '',
    date: r.date.slice(0, 10),
    items: r.items.length,
    total: r.total,
    status: r.status as Order['status'],
    paymentMethod: PM_MAP[r.paymentMethod] ?? r.paymentMethod.toUpperCase(),
    address: `${r.address}, ${r.city}, ${r.state}`,
  }
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [realOrders, setRealOrders] = useState(() => getRealOrders())
  const [mockOrders, setMockOrders] = useState<Order[]>(MOCK_ORDERS)

  // Refresh real orders when apse:orders event fires
  useEffect(() => {
    function refresh() { setRealOrders(getRealOrders()) }
    window.addEventListener('apse:orders', refresh)
    return () => window.removeEventListener('apse:orders', refresh)
  }, [])

  const orders: Order[] = [...realOrders.map(realToOrder), ...mockOrders]

  const filtered = orders.filter(o => {
    const s = search.toLowerCase()
    const matchSearch = !s || o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s) || o.email.toLowerCase().includes(s)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = filtered.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.total, 0)

  function updateStatus(id: string, status: Order['status']) {
    // Try to update a real order first; fall back to mock orders
    const isReal = realOrders.some(o => o.id === id)
    if (isReal) {
      updateRealOrderStatus(id, status)
      setRealOrders(getRealOrders())
    } else {
      setMockOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_STATUS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm px-4 py-1.5 rounded-full border capitalize transition-colors font-medium ${
              statusFilter === s ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3 items-center">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order ID, customer name or email…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Filter size={13} /> {filtered.length} results · {fmt(totalRevenue)}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Order ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Items</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Total</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Payment</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-primary font-semibold">{o.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-800">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{o.date}</td>
                  <td className="px-4 py-3.5 text-center text-gray-700">{o.items}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-gray-900">{fmt(o.total)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span title={o.paymentMethod} className="text-lg">{PAYMENT_ICON[o.paymentMethod] ?? '💰'}</span>
                    <span className="text-xs text-gray-400 block">{o.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value as Order['status'])}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                    >
                      {(['pending','processing','shipped','delivered','cancelled'] as const).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
