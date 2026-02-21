import HeroSlider from '@/components/home/HeroSlider'
import FeatureStrip from '@/components/home/FeatureStrip'
import PromoBanners from '@/components/home/PromoBanners'
import PopularProducts from '@/components/home/PopularProducts'
import NewArrivals from '@/components/home/NewArrivals'
import TopCategories from '@/components/home/TopCategories'
import FashionDeals from '@/components/home/FashionDeals'
import ProductTabs from '@/components/home/ProductTabs'

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeatureStrip />
      <PromoBanners />
      <PopularProducts />
      <NewArrivals />
      <TopCategories />
      <div className="py-8" />
      <FashionDeals />
      <ProductTabs />
    </>
  )
}
