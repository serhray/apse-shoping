import { useMemo, useState } from 'react'
import { CATEGORIES } from '@/data/mockData'
import { useProducts } from '@/hooks/useProducts'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ui/ProductCard'
import Pagination from '@/components/ui/Pagination'
import { Package, TrendingUp, ShieldCheck, Truck } from 'lucide-react'

const PAGE_SIZE = 12

const WHOLESALE_PERKS = [
  { Icon: TrendingUp, title: 'Volume Discounts', desc: 'Up to 30% off on bulk orders.' },
  { Icon: ShieldCheck, title: 'Verified Suppliers', desc: 'All suppliers are KYC verified.' },
  { Icon: Truck, title: 'Door Delivery', desc: 'Pan-India delivery for wholesale.' },
  { Icon: Package, title: 'Custom Packaging', desc: 'OEM & custom branding available.' },
]

export default function WholesalePage() {
  const [selectedCat, setSelectedCat] = useState('')
  const [page, setPage] = useState(1)
  const products = useProducts()

  const filtered = useMemo(() =>
    products.filter(p => {
      if (!p.wholesalePrice) return false
      if (selectedCat && p.categorySlug !== selectedCat) return false
      return true
    }), [products, selectedCat])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  function resetPage() { setPage(1) }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-topbar to-primary text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-3">Wholesale Marketplace</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Source products in bulk at competitive prices. Connect with verified suppliers across India.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link to="/request-quote" className="btn bg-secondary text-white hover:bg-secondary-dark">
              Request for Quote
            </Link>
            <a href="#products" className="btn bg-white/20 text-white hover:bg-white/30 border border-white/30">
              Browse Products
            </a>
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {WHOLESALE_PERKS.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 py-5 px-4">
                <Icon size={28} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div id="products" className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="section-title"><span className="section-title-bar" /> Wholesale Products</h2>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCat(''); resetPage() }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!selectedCat ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}`}
              >
                All
              </button>
              {CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCat(cat.slug); resetPage() }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCat === cat.slug ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* MOQ Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Package size={20} className="text-primary flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Minimum Order Quantity (MOQ)</strong> applies to wholesale prices. Contact us for custom orders under MOQ.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {paginated.map(p => <ProductCard key={p.id} product={p} mode="wholesale" />)}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to place a bulk order?</h3>
          <p className="text-gray-500 mb-5">Our trade team will respond within 4 business hours.</p>
          <Link to="/request-quote" className="btn-primary px-10 py-3">Get a Free Quote</Link>
        </div>
      </div>
    </div>
  )
}
