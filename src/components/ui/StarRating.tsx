import { Star } from 'lucide-react'

interface Props {
  rating: number
  max?: number
  size?: number
  showCount?: boolean
  count?: number
}

export default function StarRating({ rating, max = 5, size = 14, showCount, count }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <span key={i} className="relative">
            <Star size={size} className="text-gray-300 fill-gray-200" />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star size={size} className="text-yellow-400 fill-yellow-400" />
              </span>
            )}
          </span>
        )
      })}
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({count})</span>
      )}
    </div>
  )
}
