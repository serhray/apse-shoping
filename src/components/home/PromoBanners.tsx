import { Link } from 'react-router-dom'

const BANNERS = [
  {
    id: 1,
    tag: '20% → 30% OFF',
    title: 'Porto Watches',
    cta: 'Shop Now',
    href: '/category/electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    bg: 'from-gray-900/70 to-transparent',
  },
  {
    id: 2,
    tag: 'Starting at ₹999',
    title: 'Deal Promos',
    cta: 'Shop Now',
    href: '/retail',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    bg: 'from-blue-900/70 to-transparent',
  },
  {
    id: 3,
    tag: 'Starting at ₹999',
    title: 'Handbags',
    cta: 'Shop Now',
    href: '/category/womens-garments',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    bg: 'from-pink-900/70 to-transparent',
  },
]

export default function PromoBanners() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BANNERS.map(b => (
            <Link
              key={b.id}
              to={b.href}
              className="relative rounded-xl overflow-hidden group"
              style={{ height: 180 }}
            >
              <img
                src={b.image}
                alt={b.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${b.bg} flex flex-col justify-end p-5`}>
                <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1">{b.tag}</p>
                <h3 className="text-white font-black text-xl mb-3">{b.title}</h3>
                <span className="self-start bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded hover:bg-primary hover:text-white transition-colors">
                  {b.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
