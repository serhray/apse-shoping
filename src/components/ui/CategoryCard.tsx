import { Link } from 'react-router-dom'
import type { Category } from '@/types'

interface Props { category: Category }

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-2"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary transition-colors shadow-sm">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700 group-hover:text-primary transition-colors uppercase tracking-wide leading-tight">
          {category.name}
        </p>
        {category.productCount && (
          <p className="text-xs text-gray-400">{category.productCount} items</p>
        )}
      </div>
    </Link>
  )
}
