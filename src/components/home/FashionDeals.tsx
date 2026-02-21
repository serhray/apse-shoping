import { Link } from 'react-router-dom'

export default function FashionDeals() {
  return (
    <section className="py-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-lg">
          {/* Left – Dark Fashion Banner */}
          <div className="relative bg-gray-900 flex items-center justify-between overflow-hidden min-h-[200px]">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80"
              alt="Fashion Deals"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 p-8">
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Limited Time</p>
              <h3 className="text-white font-black text-3xl sm:text-4xl leading-tight">
                TOP FASHION<br /><span className="text-secondary">DEALS</span>
              </h3>
              <Link to="/category/womens-garments"
                className="mt-4 inline-flex btn bg-white text-gray-900 hover:bg-secondary hover:text-white text-xs px-6 py-2">
                VIEW SALE
              </Link>
            </div>
          </div>

          {/* Right – Coupon Banner */}
          <div className="relative bg-primary flex items-center overflow-hidden min-h-[200px]">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&q=80"
              alt="Exclusive Coupon"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10 p-8">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Exclusive</p>
              <h3 className="text-white font-black text-4xl leading-tight mb-1">COUPON</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-secondary text-sm font-bold uppercase">UP TO</span>
                <span className="text-white font-black text-5xl">$100</span>
                <span className="text-white font-bold text-2xl">OFF</span>
              </div>
              <Link to="/retail"
                className="btn bg-white text-primary hover:bg-secondary hover:text-white text-xs px-6 py-2">
                CLAIM NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
