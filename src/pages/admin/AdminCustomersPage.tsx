import { useState } from 'react'
import { MOCK_CUSTOMERS } from '@/lib/adminStore'
import { Search, Users, Mail, Phone, ShoppingBag } from 'lucide-react'

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN') }

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_CUSTOMERS.filter(c => {
    const s = search.toLowerCase()
    return !s || c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.city.toLowerCase().includes(s)
  })

  const totalRevenue = MOCK_CUSTOMERS.reduce((a, c) => a + c.totalSpent, 0)
  const avgOrders = Math.round(MOCK_CUSTOMERS.reduce((a, c) => a + c.orders, 0) / MOCK_CUSTOMERS.length)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-0.5">{MOCK_CUSTOMERS.length} registered customers · Total revenue: {fmt(totalRevenue)}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: MOCK_CUSTOMERS.length, Icon: Users, color: 'text-purple-500' },
          { label: 'Total Revenue', value: fmt(totalRevenue), Icon: ShoppingBag, color: 'text-green-500' },
          { label: 'Avg Orders/Customer', value: avgOrders, Icon: ShoppingBag, color: 'text-blue-500' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <Icon size={22} className={color} />
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-lg font-black text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3 items-center">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or city…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        <span className="text-sm text-gray-400">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">City</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Orders</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Total Spent</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-navbarbottom flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-0.5">
                      <Mail size={11} /> {c.email}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Phone size={11} /> {c.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{c.city}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-semibold text-gray-800">{c.orders}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-gray-900">{fmt(c.totalSpent)}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{c.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">👥</p>
            <p className="font-medium">No customers found</p>
          </div>
        )}
      </div>
    </div>
  )
}
