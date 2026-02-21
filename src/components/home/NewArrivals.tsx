import { Link } from 'react-router-dom'
import { PRODUCTS } from '@/data/mockData'
import ProductCard from '../ui/ProductCard'

export default function NewArrivals() {
  const newItems = PRODUCTS.filter(p => p.isNew)

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">
            <span className="section-title-bar" /> New Arrivals
          </h2>
          <Link to="/retail?filter=new" className="text-sm text-primary font-medium hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {newItems.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
