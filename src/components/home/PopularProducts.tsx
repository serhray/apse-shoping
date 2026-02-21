import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { PRODUCTS } from '@/data/mockData'
import ProductCard from '../ui/ProductCard'
import 'swiper/css'
import 'swiper/css/navigation'

export default function PopularProducts() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">
            <span className="section-title-bar" /> Popular Products
          </h2>
          <Link to="/retail" className="text-sm text-primary font-medium hover:underline">View All →</Link>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={2}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {PRODUCTS.map(p => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
