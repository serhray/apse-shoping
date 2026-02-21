import { Link } from 'react-router-dom'
import { CATEGORIES } from '@/data/mockData'
import CategoryCard from '../ui/CategoryCard'

export default function TopCategories() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-6 text-center">
          <span className="section-title-bar" /> Top 10 Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/retail"
            className="btn-outline text-sm px-8">
            Browse All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}
