import { Link } from 'react-router-dom'
import { useState } from 'react'
import { SERVICES, PRE_OWNED_PRODUCTS } from '@/data/mockData'
import ProductCard from '@/components/ui/ProductCard'
import { Wrench, Tag, ArrowRight } from 'lucide-react'

type Tab = 'services' | 'preowned'

export default function ServicesPreOwnedPage() {
  const [tab, setTab] = useState<Tab>('services')

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-900 to-primary text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-3">Services & Pre-Owned</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Explore professional trade services and certified pre-owned products at great value.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white sticky top-16 z-30 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex">
          {([
            { key: 'services' as Tab, label: 'Trade Services', Icon: Wrench },
            { key: 'preowned' as Tab, label: 'Pre-Owned Products', Icon: Tag },
          ]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === key ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-primary'}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Tab */}
      {tab === 'services' && (
        <div className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map(service => (
                <div key={service.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="h-44 overflow-hidden">
                    <img src={service.image} alt={service.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">{service.category}</span>
                    <h3 className="font-bold text-gray-900 mt-1 mb-2 leading-snug">{service.title}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>
                    {service.price ? (
                      <p className="font-bold text-accent text-lg mb-3">
                        Starting at ₹{service.price.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 mb-3 italic">Contact for pricing</p>
                    )}
                    <div className="flex gap-2">
                      <Link to="/request-quote"
                        className="flex-1 btn-primary text-xs py-2 gap-1.5">
                        Get Quote <ArrowRight size={12} />
                      </Link>
                      <Link to="/contact"
                        className="btn-outline text-xs px-3 py-2">
                        Enquire
                      </Link>
                    </div>
                    {service.provider && (
                      <p className="text-xs text-gray-400 mt-2 text-center">By {service.provider}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Service CTA */}
            <div className="mt-12 bg-purple-50 rounded-2xl p-8 text-center border border-purple-100">
              <h3 className="text-2xl font-bold mb-2">Need a Custom Service?</h3>
              <p className="text-gray-500 mb-5 max-w-md mx-auto">
                We can tailor our services to fit your exact business requirements. Reach out to our team.
              </p>
              <Link to="/contact" className="btn-primary px-8">Contact Us</Link>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Owned Tab */}
      {tab === 'preowned' && (
        <div className="py-10">
          <div className="container mx-auto px-4">
            {/* Info Banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <Tag size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Quality Certified Pre-Owned Goods</p>
                <p className="text-amber-600 text-xs mt-0.5">
                  All pre-owned products are inspected, graded, and certified. Conditions: Like New, Good, Refurbished.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {PRE_OWNED_PRODUCTS.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Sell Your Device CTA */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Sell Your Old Device</h3>
                <p className="text-gray-300 text-sm mb-5">
                  Get the best price for your used electronics, cameras, and gadgets. Quick evaluation and payment.
                </p>
                <Link to="/contact" className="btn bg-white text-gray-900 hover:bg-gray-100 text-sm">
                  List for Sale
                </Link>
              </div>
              <div className="bg-primary rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Certified Refurbisher?</h3>
                <p className="text-white/80 text-sm mb-5">
                  Partner with Apse Shopping to list your refurbished inventory on our trusted marketplace.
                </p>
                <Link to="/contact" className="btn bg-white text-primary hover:bg-gray-100 text-sm">
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
