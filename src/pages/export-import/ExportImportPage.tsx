import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TradeInquiry } from '@/types'
import { Globe, Ship, Package, TrendingUp, FileCheck, Users, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const SERVICES_EXPORT = [
  { Icon: FileCheck, title: 'Documentation Support', desc: 'Full assistance with export/import licences, IEC code, and customs paperwork.' },
  { Icon: Ship, title: 'Freight & Logistics', desc: 'Sea, air, and land freight solutions with tracking and insurance.' },
  { Icon: Package, title: 'Custom Packaging', desc: 'Export-grade packaging meeting international standards (ISPM-15 compliant).' },
  { Icon: TrendingUp, title: 'Market Intelligence', desc: 'Trade data, tariff advisory, and destination-market research.' },
  { Icon: Users, title: 'Buyer-Seller Matchmaking', desc: 'Connect with verified overseas buyers and Indian suppliers.' },
  { Icon: Globe, title: 'Global Network', desc: 'Partners across 40+ countries for end-to-end trade solutions.' },
]

const COUNTRIES = [
  'United States', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom',
  'Germany', 'China', 'Singapore', 'Australia', 'Canada', 'South Africa',
  'Kenya', 'Malaysia', 'Sri Lanka', 'Bangladesh', 'Nepal', 'Other',
]

const COMMODITIES = [
  'Electronics & Gadgets', "Men's & Women's Garments", 'Imitation Jewellery',
  'Kitchen Appliances', 'Food Products & Spices', 'Industrial Equipment',
  'Auto Parts', 'Agricultural Products', 'Pharmaceuticals', 'Handicrafts', 'Other',
]

export default function ExportImportPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TradeInquiry>()

  function onSubmit(_data: TradeInquiry) {
    return new Promise<void>(resolve => setTimeout(() => {
      toast.success('Trade inquiry submitted! Our export team will contact you within 24 hours.')
      setSubmitted(true)
      reset()
      resolve()
    }, 1200))
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-topbar text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-center bg-cover"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&q=80')" }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-5">
            <Globe size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight">
            Export & Import
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-8">
            Connect with global markets. We provide end-to-end trade solutions for Indian exporters
            and international importers.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="#inquiry" className="btn bg-secondary text-white hover:bg-secondary-dark text-sm px-8 py-3">
              Submit Trade Inquiry
            </a>
            <Link to="/request-quote" className="btn bg-white/20 text-white hover:bg-white/30 border border-white/30 text-sm px-8 py-3">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            {[
              { value: '40+', label: 'Countries Served' },
              { value: '500+', label: 'Export Partners' },
              { value: '10K+', label: 'Shipments Handled' },
              { value: '₹200Cr+', label: 'Trade Volume' },
            ].map(({ value, label }) => (
              <div key={label} className="py-5 px-6 text-center">
                <p className="text-3xl font-black text-secondary">{value}</p>
                <p className="text-white/80 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-10">
            <span className="section-title-bar" /> Our Trade Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_EXPORT.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Icon size={22} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Process */}
      <div className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-10"><span className="section-title-bar" /> Trade Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden lg:block absolute top-8 left-8 right-8 h-0.5 bg-gray-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { num: 1, title: 'Inquiry', desc: 'Submit your export/import requirements.' },
                  { num: 2, title: 'Assessment', desc: 'Trade experts assess your commodity and destination.' },
                  { num: 3, title: 'Documentation', desc: 'We handle all regulatory paperwork.' },
                  { num: 4, title: 'Shipment', desc: 'Goods shipped with full tracking.' },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="text-center relative">
                    <div className="w-16 h-16 rounded-full bg-primary text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg z-10 relative">
                      {num}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div id="inquiry" className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8"><span className="section-title-bar" /> Trade Inquiry Form</h2>

            {submitted ? (
              <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-100">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Inquiry Submitted!</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Our export team will review and contact you within 24 hours.
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setSubmitted(false)} className="btn-outline">Submit Another</button>
                  <Link to="/" className="btn-primary">Back to Home</Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                      <input {...register('companyName', { required: 'Required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Acme Exports Pvt Ltd" />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Name *</label>
                      <input {...register('contactName', { required: 'Required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="John Smith" />
                      {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                        type="email"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="john@company.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                      <input {...register('phone', { required: 'Required' })}
                        type="tel"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="+91 / +1 / +44…" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade Type *</label>
                      <div className="flex gap-3">
                        {(['export', 'import'] as const).map(t => (
                          <label key={t} className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <input {...register('tradeType', { required: 'Required' })} type="radio" value={t} className="accent-primary" />
                            <span className="text-sm font-medium capitalize">{t}</span>
                          </label>
                        ))}
                      </div>
                      {errors.tradeType && <p className="text-red-500 text-xs mt-1">{errors.tradeType.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
                      <select {...register('country', { required: 'Required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white">
                        <option value="">Select Country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Commodity / Product *</label>
                    <select {...register('commodity', { required: 'Required' })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="">Select Commodity</option>
                      {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.commodity && <p className="text-red-500 text-xs mt-1">{errors.commodity.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity & Unit *</label>
                      <input {...register('quantity', { required: 'Required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. 5 Containers / 1000 MT" />
                      {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Market / Port *</label>
                      <input {...register('targetMarket', { required: 'Required' })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. Dubai, Port Jebel Ali" />
                      {errors.targetMarket && <p className="text-red-500 text-xs mt-1">{errors.targetMarket.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                    <textarea {...register('notes')} rows={3}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                      placeholder="Incoterms preference, packaging, certifications needed, etc." />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full btn-primary py-3 text-base gap-2 disabled:opacity-60">
                    {isSubmitting ? 'Submitting…' : <><span>Submit Trade Inquiry</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
