import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { CATEGORIES } from '@/data/mockData'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ui/ProductCard'
import Pagination from '@/components/ui/Pagination'

const PAGE_SIZE = 12

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState(1)
  const category = CATEGORIES.find(c => c.slug === slug)
  const allProducts = useProducts()
  const products = allProducts.filter(p => p.categorySlug === slug)
  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <nav className="text-sm text-gray-500 mb-5">
          <Link to="/" className="hover:text-primary">Home</Link> /{' '}
          <Link to="/retail" className="hover:text-primary">Retail</Link> /{' '}
          <span className="text-gray-800 font-medium">{category?.name ?? slug}</span>
        </nav>

        {/* Banner */}
        {category && (
          <div className="relative rounded-xl overflow-hidden mb-8 h-40">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8">
              <div>
                <h1 className="text-3xl font-black text-white">{category.name}</h1>
                <p className="text-white/80 text-sm mt-1">{category.productCount} products available</p>
              </div>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <h2 className="text-xl font-bold mb-2">No products in this category yet</h2>
            <Link to="/retail" className="btn-primary mt-4">Back to Shop</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
