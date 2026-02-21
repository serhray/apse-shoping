import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice, truncate } from '@/lib/utils'
import StarRating from './StarRating'
import toast from 'react-hot-toast'

interface Props {
  product: Product
  mode?: 'retail' | 'wholesale'
  compact?: boolean
}

export default function ProductCard({ product, mode = 'retail', compact = false }: Props) {
  const { addItem } = useCart()
  const { toggle, isWished } = useWishlist()
  const wished = isWished(product.id)
  const displayPrice = mode === 'wholesale' && product.wholesalePrice
    ? product.wholesalePrice
    : product.price

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product, 1, mode)
    toast.success(`${truncate(product.name, 30)} added to cart!`)
  }

  return (
    <div className="product-card group relative">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.discount && (
          <span className="badge bg-accent text-white">{product.discount}% OFF</span>
        )}
        {product.isNew && (
          <span className="badge bg-green-500 text-white">NEW</span>
        )}
        {product.condition && product.condition !== 'new' && (
          <span className="badge bg-purple-500 text-white capitalize">{product.condition}</span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={e => { e.preventDefault(); toggle(product); toast(wished ? 'Removed from wishlist' : 'Added to wishlist!', { icon: wished ? '💔' : '❤️' }) }}
        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ${wished ? 'text-accent' : 'text-gray-400 hover:text-accent'}`}
      >
        <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${compact ? 'h-40' : 'h-52'}`}
          />
        </div>

        {/* Body */}
        <div className="p-3">
          <p className="text-xs text-primary font-medium mb-1">{product.category}</p>
          <h3 className={`font-medium text-gray-800 mb-1.5 leading-snug ${compact ? 'text-xs' : 'text-sm'}`}>
            {compact ? truncate(product.name, 50) : truncate(product.name, 80)}
          </h3>

          <StarRating rating={product.rating} showCount count={product.reviews} />

          <div className="flex items-baseline gap-2 mt-2">
            {product.originalPrice && (
              <span className="price-old">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="price-new">{formatPrice(displayPrice)}</span>
          </div>

          {mode === 'wholesale' && product.moq && (
            <p className="text-xs text-gray-500 mt-1">MOQ: {product.moq} units</p>
          )}
        </div>
      </Link>

      {/* Action */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 btn-primary text-xs flex items-center justify-center gap-1.5">
          <ShoppingCart size={13} />
          Add to Cart
        </button>
        <Link to={`/product/${product.slug}`}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors flex-shrink-0">
          <Eye size={14} />
        </Link>
      </div>
    </div>
  )
}
