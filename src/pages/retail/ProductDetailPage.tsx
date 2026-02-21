import { useParams, Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/context/CartContext'
import StarRating from '@/components/ui/StarRating'
import ProductCard from '@/components/ui/ProductCard'
import { useState } from 'react'
import { ShoppingCart, Heart, Share2, Package, Truck, Shield } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const products = useProducts()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail')
  const [activeImg, setActiveImg] = useState(0)

  const productFound = products.find(p => p.slug === slug)

  if (!productFound) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <Link to="/retail" className="btn-primary mt-4">Back to Shop</Link>
      </div>
    )
  }

  const product = productFound!
  const images = product.images ?? [product.image]
  const price = mode === 'wholesale' && product.wholesalePrice ? product.wholesalePrice : product.price

  function handleAddToCart() {
    addItem(product, qty, mode)
    toast.success(`Added ${qty}x ${product.name.slice(0, 30)}… to cart`)
  }

  const related = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-5">
          <Link to="/" className="hover:text-primary">Home</Link> /{' '}
          <Link to="/retail" className="hover:text-primary">Retail</Link> /{' '}
          <Link to={`/category/${product.categorySlug}`} className="hover:text-primary">{product.category}</Link> /{' '}
          <span className="text-gray-800">{product.name.slice(0, 40)}…</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Images */}
          <div>
            <div className="rounded-lg overflow-hidden bg-gray-50 mb-3" style={{ height: 380 }}>
              <img src={images[activeImg]} alt={product.name}
                className="w-full h-full object-contain transition-all duration-300" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded border-2 overflow-hidden transition-colors ${activeImg === i ? 'border-primary' : 'border-gray-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h1>
              <button className="text-gray-400 hover:text-accent flex-shrink-0 mt-1"><Heart size={20} /></button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={product.rating} showCount count={product.reviews} />
              <span className="text-xs text-gray-400">|</span>
              <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-baseline gap-3 mb-1">
                {product.originalPrice && (
                  <span className="price-old text-base">{formatPrice(product.originalPrice)}</span>
                )}
                <span className="text-3xl font-black text-accent">{formatPrice(price)}</span>
                {product.discount && (
                  <span className="badge bg-accent text-white">{product.discount}% OFF</span>
                )}
              </div>

              {/* Mode Toggle (if wholesale available) */}
              {product.wholesalePrice && (
                <div className="flex gap-2 mt-3">
                  {(['retail', 'wholesale'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${mode === m ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary'}`}
                    >
                      {m === 'retail' ? 'Retail Price' : `Wholesale (MOQ: ${product.moq})`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Key Specifications</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="text-xs bg-gray-50 rounded px-2.5 py-1.5">
                      <span className="text-gray-500">{k}: </span>
                      <span className="font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <label className="text-sm font-medium">Qty:</label>
              <div className="flex items-center border border-gray-200 rounded">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button className="px-4 py-2 rounded border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors">
                <Share2 size={16} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
              {[
                { Icon: Truck, label: 'Free Shipping', sub: 'Orders over ₹10k' },
                { Icon: Shield, label: 'Secure Payment', sub: '100% Protected' },
                { Icon: Package, label: 'Easy Returns', sub: '7 Day Policy' },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="text-center text-xs">
                  <Icon size={20} className="mx-auto text-primary mb-1" />
                  <p className="font-semibold text-gray-700">{label}</p>
                  <p className="text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title mb-5"><span className="section-title-bar" /> Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
