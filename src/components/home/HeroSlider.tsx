import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '@/data/mockData'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HeroSlider() {
  return (
    <section className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="relative"
        style={{ height: 'clamp(280px, 50vw, 540px)' }}
      >
        {HERO_SLIDES.map(slide => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={slide.id === 1 ? 'eager' : 'lazy'}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} flex items-center`}>
                <div className="container mx-auto px-8 lg:px-16">
                  <div className="max-w-lg text-white">
                    <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2 animate-pulse">
                      Special Offer
                    </p>
                    <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-3 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-white/90 text-sm sm:text-base mb-6 max-w-md">{slide.subtitle}</p>
                    <Link
                      to={slide.ctaHref}
                      className="btn bg-secondary text-white hover:bg-secondary-dark shadow-lg text-sm px-8 py-3"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
