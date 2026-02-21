import { useForm } from 'react-hook-form'
import type { QuoteRequest } from '@/types'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, Phone, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { api } from '@/lib/apiClient'

const TRADES = [
  'Electronics', "Men's Garments", "Women's Garments", 'Kitchen Cookware',
  'Furnitures', 'Imitation Jewellery', 'Food Products', 'Cleaning Products',
  'Stationery', 'Export / Import', 'Services', 'Others',
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Request', desc: 'Fill in your product requirements and trade details.' },
  { step: '02', title: 'We Process', desc: 'Our trade team reviews your inquiry within 4 hours.' },
  { step: '03', title: 'Get Quotes', desc: 'Receive competitive quotes from verified suppliers.' },
  { step: '04', title: 'Place Order', desc: 'Choose the best offer and place your order securely.' },
]

export default function RequestQuotePage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<QuoteRequest>()
  const [submitted, setSubmitted] = useState(false)

  async function onSubmit(data: QuoteRequest) {
    try {
      await api.post('/api/quotes', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        trade: data.trade,
        products: data.products,
        quantity: data.quantity,
        deliveryLocation: data.deliveryLocation,
        notes: data.notes,
      })
      toast.success('Quote request submitted! We will contact you within 4 hours.')
      setSubmitted(true)
      reset()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to submit quote')
      throw e
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-topbar to-navbarbottom text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
            <FileText size={28} />
          </div>
          <h1 className="text-4xl font-black mb-3">Request for Quote</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Need bulk pricing? Submit your requirements and our trade team will match you with the best suppliers.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-center section-title mb-8"><span className="section-title-bar" />How It Works</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  {step}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {submitted ? (
              <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-100">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Thank you! Our trade team will review your request and contact you within 4 business hours.
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setSubmitted(false)} className="btn-outline">Submit Another</button>
                  <Link to="/" className="btn-primary">Back to Home</Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6">Quote Request Form</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input {...register('name', { required: 'Name is required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="John Smith" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                        type="email"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="john@company.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                      <input {...register('phone', { required: 'Phone is required' })}
                        type="tel"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="+91 80000 00000" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Company / Business</label>
                      <input {...register('company')}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                        placeholder="Acme Traders" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade / Category *</label>
                      <select {...register('trade', { required: 'Please select a trade' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white">
                        <option value="">Select Trade</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.trade && <p className="text-red-500 text-xs mt-1">{errors.trade.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Quantity *</label>
                      <input {...register('quantity', { required: 'Quantity is required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. 500 units" />
                      {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Details *</label>
                    <textarea {...register('products', { required: 'Product details are required' })}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Describe the products you need, including specifications, brands, or alternatives…" />
                    {errors.products && <p className="text-red-500 text-xs mt-1">{errors.products.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Location *</label>
                    <input {...register('deliveryLocation', { required: 'Delivery location is required' })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="City, State, Country" />
                    {errors.deliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.deliveryLocation.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                    <textarea {...register('notes')}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                      placeholder="Packaging requirements, certifications, timelines, etc." />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting…' : 'Submit Quote Request'}
                  </button>
                </form>

                {/* Contact Alt */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-4 justify-center text-sm text-gray-500">
                  <a href="tel:8073667950" className="flex items-center gap-2 hover:text-primary">
                    <Phone size={14} /> 8073667950
                  </a>
                  <a href="mailto:contact@apseshopping.com" className="flex items-center gap-2 hover:text-primary">
                    <Mail size={14} /> contact@apseshopping.com
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
