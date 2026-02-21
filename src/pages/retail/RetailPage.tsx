import { useState, useMemo } from 'react'
import { CATEGORIES } from '@/data/mockData'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ui/ProductCard'
import Pagination from '@/components/ui/Pagination'
import { Link } from 'react-router-dom'
import { SlidersHorizontal, Grid2X2, LayoutList, ChevronDown } from 'lucide-react'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
const PAGE_SIZE = 8

export default function RetailPage() {
  const products = useProducts()
  const [selectedCat, setSelectedCat] = useState('')
  const [sort, setSort] = useState<SortKey>('default')
  const [viewGrid, setViewGrid] = useState(true)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      if (selectedCat && p.categorySlug !== selectedCat) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      return true
    })
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating)
      case 'newest': return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      default: return list
    }
  }, [products, selectedCat, sort, priceRange])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetPage() { setPage(1) }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-gray-800 font-medium">Retail</span>
        </nav>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Categories</h3>
              <button
                onClick={() => setSelectedCat('')}
                className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${!selectedCat ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCat(cat.slug); resetPage() }}
                  className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors mt-1 ${selectedCat === cat.slug ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {cat.name}
                  <span className="float-right text-xs opacity-60">{cat.productCount}</span>
                </button>
              ))}
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wide">Price Range</h3>
              <div className="space-y-2">
                {[[0, 5000], [5000, 20000], [20000, 50000], [50000, 200000]].map(([min, max]) => (
                  <label key={`${min}-${max}`} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      className="accent-primary"
                      checked={priceRange[0] === min && priceRange[1] === max}
                      onChange={() => { setPriceRange([min, max]); resetPage() }}
                    />
                    <span className="text-gray-700">₹{min.toLocaleString()} – ₹{max.toLocaleString()}</span>
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    className="accent-primary"
                    checked={priceRange[0] === 0 && priceRange[1] === 200000}
                    onChange={() => { setPriceRange([0, 200000]); resetPage() }}
                  />
                  <span className="text-gray-700">All Prices</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1.5 btn-outline text-xs px-3 py-2"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <p className="text-sm text-gray-500">
                  Showing <strong className="text-gray-800">{filtered.length}</strong> products</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value as SortKey); resetPage() }}
                    className="text-sm border border-gray-200 rounded px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">By Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* View */}
                <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setViewGrid(true)}
                    className={`p-2 ${viewGrid ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Grid2X2 size={16} />
                  </button>
                  <button
                    onClick={() => setViewGrid(false)}
                    className={`p-2 ${!viewGrid ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-medium">No products found.</p>
                <button
                onClick={() => { setSelectedCat(''); setPriceRange([0, 200000]); resetPage() }}
                  className="btn-primary mt-4 text-sm">Clear Filters</button>
              </div>
            ) : viewGrid ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map(p => <ProductCard key={p.id} product={p} mode="retail" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map(p => (
                  <div key={p.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex gap-4">
                    <img src={p.image} alt={p.name} className="w-28 h-28 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{p.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {p.originalPrice && <span className="text-gray-400 line-through text-sm">₹{p.originalPrice.toLocaleString()}</span>}
                        <span className="text-accent font-bold">₹{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
