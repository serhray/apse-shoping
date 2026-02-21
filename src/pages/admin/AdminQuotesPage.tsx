import { useState } from 'react'
import { MOCK_QUOTES } from '@/lib/adminStore'
import type { QuoteEntry } from '@/lib/adminStore'
import { Search, FileText, Building2, MapPin, Package } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  new:       'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  quoted:    'bg-green-100 text-green-700',
  closed:    'bg-gray-100 text-gray-600',
}

const STATUSES = ['all', 'new', 'reviewing', 'quoted', 'closed'] as const

export default function AdminQuotesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [quotes, setQuotes] = useState<QuoteEntry[]>(MOCK_QUOTES)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = quotes.filter(q => {
    const s = search.toLowerCase()
    const matchSearch = !s || q.name.toLowerCase().includes(s) || q.email.toLowerCase().includes(s) || q.products.toLowerCase().includes(s)
    const matchStatus = statusFilter === 'all' || q.status === statusFilter
    return matchSearch && matchStatus
  })

  function updateStatus(id: string, status: QuoteEntry['status']) {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Quote Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {quotes.length} total · {quotes.filter(q => q.status === 'new').length} new
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm px-4 py-1.5 rounded-full border capitalize transition-colors font-medium ${
              statusFilter === s ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {s} {s !== 'all' && `(${quotes.filter(q => q.status === s).length})`}
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
          placeholder="Search by company, email or products…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        <span className="text-sm text-gray-400">{filtered.length} results</span>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-16 text-gray-400">
            <FileText size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="font-medium">No quote requests found</p>
          </div>
        )}

        {filtered.map(q => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header row */}
            <div
              className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{q.name}
                  {q.company && <span className="text-gray-400 font-normal text-sm"> · {q.company}</span>}
                </p>
                <p className="text-sm text-gray-500 truncate">{q.products}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-gray-400">{q.date}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[q.status]}`}>
                  {q.status}
                </span>
              </div>
            </div>

            {/* Expanded details */}
            {expanded === q.id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 size={14} className="text-gray-400" />
                      <span className="font-medium">Company:</span> {q.company || '—'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400">✉️</span>
                      <span className="font-medium">Email:</span> {q.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400">📞</span>
                      <span className="font-medium">Phone:</span> {q.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400">🔄</span>
                      <span className="font-medium">Trade Type:</span> {q.trade}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Package size={14} className="text-gray-400 mt-0.5" />
                      <div><span className="font-medium">Products:</span> {q.products}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400">#</span>
                      <span className="font-medium">Quantity:</span> {q.quantity}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="font-medium">Delivery:</span> {q.deliveryLocation}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Update Status:</span>
                  <div className="flex gap-2 flex-wrap">
                    {(['new', 'reviewing', 'quoted', 'closed'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(q.id, s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-colors border ${
                          q.status === s
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <a
                    href={`mailto:${q.email}?subject=Re: Quote Request - ${q.products}`}
                    className="ml-auto text-sm text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    ✉️ Reply via Email
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
