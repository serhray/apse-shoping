import { useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ui/ProductCard'
import Pagination from '@/components/ui/Pagination'
import { Search } from 'lucide-react'

const PAGE_SIZE = 10

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [page, setPage] = useState(1)
  const products = useProducts()

  const results = useMemo(() => {
    setPage(1)
    if (!q) return []
    const lower = q.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags?.some(t => t.toLowerCase().includes(lower))
    )
  }, [q, products])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const paginated = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Search size={20} className="text-gray-400" />
          <h1 className="text-xl font-bold">
            Search results for "<span className="text-primary">{q}</span>"
          </h1>
          <span className="text-gray-400 text-sm">({results.length} products)</span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <Search size={56} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">No results found</h2>
            <p className="text-gray-400">Try different keywords or browse our categories.</p>
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
