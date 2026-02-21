import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ui/ProductCard'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, remove, clearWishlist, count } = useWishlist()
  const { addItem } = useCart()

  if (count === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Heart size={64} className="mx-auto text-gray-200 mb-5" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-8">Save products you love and come back to them later.</p>
        <Link to="/retail" className="btn-primary px-10 py-3">
          Start Shopping
        </Link>
      </div>
    )
  }

  function moveAllToCart() {
    items.forEach(p => addItem(p, 1, 'retail'))
    clearWishlist()
    toast.success(`${count} item${count > 1 ? 's' : ''} moved to cart!`)
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-black">
            Wishlist <span className="text-gray-400 font-normal text-base">({count} items)</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={moveAllToCart}
              className="btn-primary text-sm gap-2 flex items-center"
            >
              <ShoppingCart size={15} />
              Move All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="text-sm text-red-500 hover:text-red-700 transition-colors border border-red-200 hover:border-red-400 px-4 py-2 rounded"
            >
              Clear Wishlist
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(product => (
            <div key={product.id} className="relative">
              <button
                onClick={() => remove(product.id)}
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                title="Remove from wishlist"
              >
                ×
              </button>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
