import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, CheckCircle, Truck, MapPin, Clock } from 'lucide-react'
import { getRealOrders } from '@/lib/ordersStore'
import type { RealOrder } from '@/lib/ordersStore'

// ─── Mock tracking data ───────────────────────────────────────────────────────

type TrackData = {
  orderId: string
  status: string
  product: string
  estimatedDelivery: string
  carrier: string
  trackingNumber: string
  timeline: { label: string; date: string; done: boolean; icon: React.ElementType }[]
}

const MOCK_TRACKS: Record<string, TrackData> = {
  'APE-MC4X2': {
    orderId: 'APE-MC4X2',
    status: 'Delivered',
    product: 'Canon R100 Mirrorless + 2 more items',
    estimatedDelivery: '15 Feb 2026',
    carrier: 'Delhivery',
    trackingNumber: 'DL8839271048',
    timeline: [
      { label: 'Order Placed', date: '12 Feb 2026, 10:30 AM', done: true, icon: Package },
      { label: 'Packed & Dispatched', date: '13 Feb 2026, 02:15 PM', done: true, icon: Package },
      { label: 'In Transit – Hubli Hub', date: '14 Feb 2026, 08:00 AM', done: true, icon: Truck },
      { label: 'Out for Delivery', date: '15 Feb 2026, 09:45 AM', done: true, icon: MapPin },
      { label: 'Delivered', date: '15 Feb 2026, 01:20 PM', done: true, icon: CheckCircle },
    ],
  },
  'APE-LC9K1': {
    orderId: 'APE-LC9K1',
    status: 'Shipped',
    product: 'Sony Alpha ILCE-6600M',
    estimatedDelivery: '22 Feb 2026',
    carrier: 'Bluedart',
    trackingNumber: 'BD9920117431',
    timeline: [
      { label: 'Order Placed', date: '28 Jan 2026, 11:00 AM', done: true, icon: Package },
      { label: 'Packed & Dispatched', date: '29 Jan 2026, 04:00 PM', done: true, icon: Package },
      { label: 'In Transit – Mumbai Hub', date: '30 Jan 2026, 06:30 AM', done: true, icon: Truck },
      { label: 'Out for Delivery', date: '—', done: false, icon: MapPin },
      { label: 'Delivered', date: '—', done: false, icon: CheckCircle },
    ],
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

function realOrderToTrack(o: RealOrder): TrackData {
  const statusDone: Record<string, number> = {
    pending: 1, processing: 2, shipped: 3, delivered: 5, cancelled: 1,
  }
  const done = statusDone[o.status] ?? 1
  const displayStatus = o.status.charAt(0).toUpperCase() + o.status.slice(1)
  const placedDate = new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const STEPS: { label: string; icon: React.ElementType }[] = [
    { label: 'Order Placed', icon: Package },
    { label: 'Packed & Dispatched', icon: Package },
    { label: 'In Transit', icon: Truck },
    { label: 'Out for Delivery', icon: MapPin },
    { label: 'Delivered', icon: CheckCircle },
  ]

  const prods = o.items.slice(0, 2).map(i => i.name).join(', ')
  const productLabel = o.items.length > 2 ? `${prods} +${o.items.length - 2} more` : prods

  return {
    orderId: o.id,
    status: displayStatus,
    product: productLabel,
    estimatedDelivery: o.status === 'delivered' ? placedDate : 'In Progress',
    carrier: 'Delhivery',
    trackingNumber: o.id.replace('APE-', 'DL') + '001',
    timeline: STEPS.map((s, i) => ({
      label: s.label,
      date: i === 0 ? placedDate : i < done ? placedDate : '—',
      done: i < done,
      icon: s.icon,
    })),
  }
}

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('id') ?? '')
  const [searched, setSearched] = useState(!!searchParams.get('id'))

  const upperOrderId = orderId.toUpperCase()
  const mockTrack = MOCK_TRACKS[upperOrderId]
  const realOrder = !mockTrack ? getRealOrders().find(o => o.id === upperOrderId) : undefined
  const track: TrackData | undefined = mockTrack ?? (realOrder ? realOrderToTrack(realOrder) : undefined)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Truck size={26} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your order ID to see real-time delivery status.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg mx-auto">
          <div className="flex-1 relative">
            <input
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. APE-MC4X2"
              className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 uppercase"
            />
          </div>
          <button type="submit" className="btn-primary px-6 gap-2 flex items-center">
            <Search size={16} /> Track
          </button>
        </form>

        {/* Results */}
        {searched && !track && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-lg font-bold text-gray-700 mb-1">Order Not Found</h3>
            <p className="text-gray-400 text-sm">
              No order found with ID <strong>{orderId}</strong>.
              Try <strong>APE-MC4X2</strong> or <strong>APE-LC9K1</strong> as demo orders.
            </p>
          </div>
        )}

        {searched && track && (
          <div className="space-y-5">
            {/* Status card */}
            <div className={`rounded-2xl p-5 flex items-center gap-4 ${
              track.status === 'Delivered' ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                track.status === 'Delivered' ? 'bg-green-500' : 'bg-primary'
              }`}>
                {track.status === 'Delivered'
                  ? <CheckCircle size={22} className="text-white" />
                  : <Truck size={22} className="text-white" />
                }
              </div>
              <div className="flex-1">
                <p className="font-black text-lg text-gray-900">{track.status}</p>
                <p className="text-sm text-gray-500">{track.product}</p>
              </div>
              {track.status !== 'Delivered' && (
                <div className="text-right">
                  <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Clock size={11} /> Estimated Delivery
                  </p>
                  <p className="font-bold text-sm text-gray-800">{track.estimatedDelivery}</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-gray-400 text-xs">Order ID</p><p className="font-bold text-primary">{track.orderId}</p></div>
                <div><p className="text-gray-400 text-xs">Carrier</p><p className="font-semibold">{track.carrier}</p></div>
                <div><p className="text-gray-400 text-xs">Tracking No.</p><p className="font-semibold">{track.trackingNumber}</p></div>
                <div><p className="text-gray-400 text-xs">Est. Delivery</p><p className="font-semibold">{track.estimatedDelivery}</p></div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold mb-6">Tracking Timeline</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />

                <div className="space-y-6">
                  {track.timeline.map(({ label, date, done, icon: Icon }, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        done ? 'bg-primary' : 'bg-gray-100'
                      }`}>
                        <Icon size={15} className={done ? 'text-white' : 'text-gray-400'} />
                      </div>
                      <div className="pt-0.5">
                        <p className={`font-semibold text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-gray-400">{date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helper */}
        {!searched && (
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">
              Demo order IDs — try <strong>APE-MC4X2</strong> (Delivered) or <strong>APE-LC9K1</strong> (Shipped)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
