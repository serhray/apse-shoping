import { Link } from 'react-router-dom'
import { getProducts, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_QUOTES } from '@/lib/adminStore'
import { Package, ShoppingBag, Users, FileText, TrendingUp, ArrowUpRight, Clock } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const QUOTE_COLOR: Record<string, string> = {
  new:       'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  quoted:    'bg-green-100 text-green-700',
  closed:    'bg-gray-100 text-gray-600',
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

export default function AdminDashboard() {
  const products = getProducts()
  const totalRevenue = MOCK_ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'pending').length
  const newQuotes = MOCK_QUOTES.filter(q => q.status === 'new').length

  const STATS = [
    { label: 'Total Products', value: products.length, Icon: Package, color: 'bg-blue-500', sub: `${products.filter(p => p.isNew).length} new this week` },
    { label: 'Total Orders', value: MOCK_ORDERS.length, Icon: ShoppingBag, color: 'bg-indigo-500', sub: `${pendingOrders} pending` },
    { label: 'Customers', value: MOCK_CUSTOMERS.length, Icon: Users, color: 'bg-purple-500', sub: 'Registered users' },
    { label: 'Revenue', value: fmt(totalRevenue), Icon: TrendingUp, color: 'bg-green-500', sub: 'Delivered orders' },
  ]

  const recentOrders = [...MOCK_ORDERS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening in your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{sub}</p>
              </div>
              <div className={`${color} p-2.5 rounded-xl`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map(o => (
              <div key={o.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{o.customer}</p>
                  <p className="text-xs text-gray-400">{o.id} · {o.date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[o.status]}`}>
                  {o.status}
                </span>
                <span className="text-sm font-bold text-gray-800 w-24 text-right">{fmt(o.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quote requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Quote Requests
                {newQuotes > 0 && (
                  <span className="bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{newQuotes}</span>
                )}
              </h2>
              <Link to="/admin/quotes" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_QUOTES.slice(0, 4).map(q => (
                <div key={q.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{q.name}</p>
                    <p className="text-xs text-gray-400 truncate">{q.products}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${QUOTE_COLOR[q.status]}`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/admin/products" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary font-medium p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                <Package size={15} className="text-blue-500" /> Add New Product
              </Link>
              <Link to="/admin/orders" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary font-medium p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                <Clock size={15} className="text-yellow-500" /> View Pending Orders
              </Link>
              <Link to="/admin/quotes" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary font-medium p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                <FileText size={15} className="text-purple-500" /> Respond to Quotes
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary font-medium p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                <ArrowUpRight size={15} className="text-green-500" /> Preview Storefront
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
