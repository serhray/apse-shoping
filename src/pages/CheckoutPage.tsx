import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { saveRealOrder, buildOrder } from '@/lib/ordersStore'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, ChevronRight, Lock, Package, Truck, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
}

interface PaymentForm {
  method: 'cod' | 'upi' | 'card'
  upiId?: string
  cardNumber?: string
  cardName?: string
  cardExpiry?: string
  cardCvv?: string
}

type Step = 'shipping' | 'payment' | 'confirmation'

const STEPS = [
  { key: 'shipping' as Step, label: 'Shipping' },
  { key: 'payment' as Step, label: 'Payment' },
  { key: 'confirmation' as Step, label: 'Confirm' },
]

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary() {
  const { items, total, count } = useCart()
  const shipping = total >= 10000 ? 0 : 199
  const grandTotal = total + shipping

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-24">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
        {items.map(({ product, quantity, mode }) => {
          const price = mode === 'wholesale' && product.wholesalePrice
            ? product.wholesalePrice : product.price
          return (
            <div key={`${product.id}-${mode}`} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img src={product.image} alt={product.name}
                  className="w-12 h-12 rounded object-cover" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-400 capitalize">{mode}</p>
              </div>
              <span className="text-xs font-semibold flex-shrink-0">{formatPrice(price * quantity)}</span>
            </div>
          )
        })}
      </div>
      <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal ({count} items)</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-accent">{formatPrice(grandTotal)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
        <Lock size={12} /> Secure SSL encrypted checkout
      </div>
    </div>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            i < idx ? 'text-green-600' :
            i === idx ? 'bg-primary text-white' :
            'text-gray-400'
          }`}>
            {i < idx ? <CheckCircle size={16} /> : <span>{i + 1}</span>}
            {step.label}
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight size={16} className={`mx-1 ${i < idx ? 'text-green-400' : 'text-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, total, count, clearCart } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('shipping')
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentForm['method']>('cod')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId] = useState(() => `APE-${Date.now().toString(36).toUpperCase()}`)

  const shippingForm = useForm<ShippingForm>({
    defaultValues: user ? {
      firstName: user.name.split(' ')[0] ?? '',
      lastName: user.name.split(' ').slice(1).join(' ') ?? '',
      email: user.email,
      phone: user.phone,
    } : {}
  })

  const shipping = total >= 10000 ? 0 : 199
  const grandTotal = total + shipping

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (count === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Package size={56} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <Link to="/retail" className="btn-primary mt-4 inline-block">Start Shopping</Link>
      </div>
    )
  }

  // ── Order Placed Success Screen ───────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-12">
          <CheckCircle size={72} className="text-green-500 mx-auto mb-5" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-1">Thank you, <strong>{shippingData?.firstName}</strong>!</p>
          <p className="text-gray-400 text-sm mb-6">
            Your order <strong className="text-primary">{orderId}</strong> has been confirmed.
            A confirmation will be sent to <strong>{shippingData?.email}</strong>.
          </p>

          <div className="bg-white rounded-xl border border-gray-100 p-5 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-bold text-primary">{orderId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-semibold capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="font-bold text-accent">{formatPrice(grandTotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Ship to</span><span className="font-semibold">{shippingData?.city}, {shippingData?.state}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/track-order" className="btn-outline text-sm px-6 py-2.5">Track Order</Link>
            <Link to="/" className="btn-primary text-sm px-6 py-2.5">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: Shipping ────────────────────────────────────────────────────────
  function handleShipping(data: ShippingForm) {
    setShippingData(data)
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Step: Payment → Confirm → Place order ─────────────────────────────────
  function handlePayment() {
    setStep('confirmation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function placeOrder() {
    const order = buildOrder({
      orderId,
      shippingData: shippingData!,
      paymentMethod,
      cartItems: items,
      subtotal: total,
      shipping,
      grandTotal,
    })
    saveRealOrder(order)
    setTimeout(() => {
      clearCart()
      setOrderPlaced(true)
      toast.success('Order placed successfully!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
    toast.loading('Processing your order…', { duration: 1400 })
  }

  const fieldClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Left: forms */}
          <div className="lg:col-span-2">

            {/* ── Shipping Form ── */}
            {step === 'shipping' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Truck size={20} className="text-primary" />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>
                <form onSubmit={shippingForm.handleSubmit(handleShipping)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name *</label>
                      <input {...shippingForm.register('firstName', { required: 'Required' })}
                        className={fieldClass} placeholder="Rahul" />
                      {shippingForm.formState.errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Last Name *</label>
                      <input {...shippingForm.register('lastName', { required: 'Required' })}
                        className={fieldClass} placeholder="Sharma" />
                      {shippingForm.formState.errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input {...shippingForm.register('email', {
                        required: 'Required',
                        pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
                      })} type="email" className={fieldClass} placeholder="rahul@email.com" />
                      {shippingForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Phone *</label>
                      <input {...shippingForm.register('phone', { required: 'Required' })}
                        type="tel" className={fieldClass} placeholder="+91 98000 00000" />
                      {shippingForm.formState.errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address *</label>
                    <textarea {...shippingForm.register('address', { required: 'Required' })}
                      rows={2} className={`${fieldClass} resize-none`}
                      placeholder="Street address, apartment, building…" />
                    {shippingForm.formState.errors.address && (
                      <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.address.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>City *</label>
                      <input {...shippingForm.register('city', { required: 'Required' })}
                        className={fieldClass} placeholder="Hubli" />
                      {shippingForm.formState.errors.city && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>State *</label>
                      <input {...shippingForm.register('state', { required: 'Required' })}
                        className={fieldClass} placeholder="Karnataka" />
                      {shippingForm.formState.errors.state && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Pincode *</label>
                      <input {...shippingForm.register('pincode', {
                        required: 'Required',
                        pattern: { value: /^\d{6}$/, message: '6 digits' },
                      })} className={fieldClass} placeholder="580023" />
                      {shippingForm.formState.errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">{shippingForm.formState.errors.pincode.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <select {...shippingForm.register('country')} className={`${fieldClass} bg-white`}>
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Link to="/cart" className="text-sm text-primary hover:underline">← Back to Cart</Link>
                    <button type="submit" className="btn-primary px-8 py-2.5 text-sm">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Payment Form ── */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={20} className="text-primary" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {([
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives.' },
                    { value: 'upi', label: 'UPI / GPay / PhonePe', desc: 'Instant transfer via UPI.' },
                    { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay.' },
                  ] as const).map(opt => (
                    <label key={opt.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payMethod"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="mt-0.5 accent-primary"
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* UPI field */}
                {paymentMethod === 'upi' && (
                  <div className="mb-6 bg-blue-50 rounded-xl p-5">
                    <label className={labelClass}>UPI ID *</label>
                    <input className={fieldClass} placeholder="yourname@upi" />
                    <p className="text-xs text-gray-400 mt-2">Enter your UPI ID and approve the payment request on your app.</p>
                  </div>
                )}

                {/* Card fields */}
                {paymentMethod === 'card' && (
                  <div className="mb-6 bg-blue-50 rounded-xl p-5 space-y-3">
                    <div>
                      <label className={labelClass}>Card Number *</label>
                      <input className={fieldClass} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div>
                      <label className={labelClass}>Cardholder Name *</label>
                      <input className={fieldClass} placeholder="RAHUL SHARMA" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Expiry *</label>
                        <input className={fieldClass} placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className={labelClass}>CVV *</label>
                        <input className={fieldClass} placeholder="•••" maxLength={4} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep('shipping')} className="text-sm text-primary hover:underline">
                    ← Back to Shipping
                  </button>
                  <button onClick={handlePayment} className="btn-primary px-8 py-2.5 text-sm">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* ── Confirmation ── */}
            {step === 'confirmation' && shippingData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <h2 className="text-xl font-bold">Review Your Order</h2>

                {/* Shipping summary */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Ship To</h3>
                    <button onClick={() => setStep('shipping')} className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                  <p className="font-semibold text-gray-900">{shippingData.firstName} {shippingData.lastName}</p>
                  <p className="text-sm text-gray-500">{shippingData.address}</p>
                  <p className="text-sm text-gray-500">{shippingData.city}, {shippingData.state} – {shippingData.pincode}</p>
                  <p className="text-sm text-gray-500">{shippingData.phone} · {shippingData.email}</p>
                </div>

                {/* Payment summary */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Payment</h3>
                    <button onClick={() => setStep('payment')} className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                  <p className="font-semibold">
                    {paymentMethod === 'cod' ? '💵 Cash on Delivery' :
                     paymentMethod === 'upi' ? '📱 UPI / GPay' :
                     '💳 Credit / Debit Card'}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-3">Items ({count})</h3>
                  <div className="space-y-2">
                    {items.map(({ product, quantity, mode }) => {
                      const price = mode === 'wholesale' && product.wholesalePrice ? product.wholesalePrice : product.price
                      return (
                        <div key={`${product.id}-${mode}`} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{product.name.slice(0, 45)}… × {quantity}</span>
                          <span className="font-semibold">{formatPrice(price * quantity)}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
                    <span>Grand Total</span>
                    <span className="text-accent">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep('payment')} className="text-sm text-primary hover:underline">
                    ← Back
                  </button>
                  <button onClick={placeOrder} className="btn-primary px-10 py-3 text-sm gap-2 flex items-center">
                    <Lock size={14} /> Place Order · {formatPrice(grandTotal)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
