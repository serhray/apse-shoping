import { Truck, CreditCard, Headphones, ShieldCheck } from 'lucide-react'

const FEATURES = [
  { Icon: Truck, title: 'Free Shipping & Return', desc: 'Free shipping on all orders over ₹10,000.' },
  { Icon: CreditCard, title: 'Money Back Guarantee', desc: '100% money back guarantee.' },
  { Icon: Headphones, title: 'Online Support 24/7', desc: 'Dedicated support team available anytime.' },
  { Icon: ShieldCheck, title: 'Secure Payment', desc: 'All transactions encrypted and secure.' },
]

export default function FeatureStrip() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 py-6 px-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
