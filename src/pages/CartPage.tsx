import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, total, count, updateQty, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-5" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add items to your cart to continue shopping.</p>
        <Link to="/retail" className="btn-primary px-10 py-3">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-black mb-6">
          Shopping Cart <span className="text-gray-400 font-normal text-base">({count} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <span>Product</span>
                <span>Mode</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>

              {items.map(({ product, quantity, mode }) => {
                const price = mode === 'wholesale' && product.wholesalePrice
                  ? product.wholesalePrice : product.price
                return (
                  <div key={`${product.id}-${mode}`}
                    className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-t border-gray-50 first:border-0">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/product/${product.slug}`}
                          className="font-semibold text-gray-800 hover:text-primary transition-colors text-sm line-clamp-2">
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                      </div>
                    </div>

                    {/* Mode */}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize w-fit ${mode === 'wholesale' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {mode}
                    </span>

                    {/* Unit Price */}
                    <span className="font-semibold text-sm">{formatPrice(price)}</span>

                    {/* Qty */}
                    <div className="flex items-center border border-gray-200 rounded w-fit">
                      <button onClick={() => updateQty(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-sm">
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-sm">
                        +
                      </button>
                    </div>

                    {/* Subtotal + Delete */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-accent text-sm">{formatPrice(price * quantity)}</span>
                      <button onClick={() => removeItem(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center mt-4">
              <Link to="/retail" className="text-sm text-primary hover:underline flex items-center gap-1">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({count} items)</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={total >= 10000 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {total >= 10000 ? 'FREE' : formatPrice(199)}
                  </span>
                </div>
                {total < 10000 && (
                  <p className="text-xs text-orange-500 bg-orange-50 rounded px-3 py-2">
                    Add {formatPrice(10000 - total)} more for FREE shipping!
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-accent">{formatPrice(total >= 10000 ? total : total + 199)}</span>
                </div>
              </div>
              <Link to="/checkout"
                className="btn-primary w-full mt-5 py-3 text-sm gap-2 flex items-center justify-center">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span> Secure & Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
