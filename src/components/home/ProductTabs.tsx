import { PRODUCTS } from '@/data/mockData'
import type { Product } from '@/types'
import { Link } from 'react-router-dom'
import { formatPrice, truncate } from '@/lib/utils'
import StarRating from '../ui/StarRating'

// ─── Mini product row ─────────────────────────────────────────────────────────
function MiniProductItem({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 group"
    >
      <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors leading-snug">
          {truncate(product.name, 38)}
        </p>
        <StarRating rating={product.rating} size={11} />
        <p className="text-primary font-bold text-sm mt-0.5">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

// ─── Column definition (all 4 visible simultaneously, like apseshopping.com) ──
const COLUMNS = [
  { label: 'Featured Products',    items: PRODUCTS.filter(p => p.isFeatured).slice(0, 4) },
  { label: 'Best Selling',         items: PRODUCTS.filter(p => p.isBestSeller).slice(0, 4) },
  { label: 'Latest Products',      items: PRODUCTS.filter(p => p.isNew).slice(0, 4) },
  { label: 'Top Rated Products',   items: PRODUCTS.filter(p => p.isTopRated).slice(0, 4) },
]

export default function ProductTabs() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map(col => (
            <div key={col.label}>
              {/* Column header */}
              <h3 className="font-black text-sm text-gray-900 uppercase tracking-wide pb-3 border-b-2 border-primary mb-1">
                {col.label}
              </h3>
              {/* Product list */}
              <div>
                {col.items.length > 0
                  ? col.items.map(p => <MiniProductItem key={p.id} product={p} />)
                  : PRODUCTS.slice(0, 4).map(p => <MiniProductItem key={p.id} product={p} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
