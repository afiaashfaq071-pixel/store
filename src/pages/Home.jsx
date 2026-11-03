import Hero from '../components/home/Hero.jsx';
import CategorySection from '../components/home/CategorySection.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import PromotionalBanner from '../components/home/PromotionalBanner.jsx';
import DealsSection from '../components/home/DealsSection.jsx';
import BestSellers from '../components/home/BestSellers.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import Newsletter from '../components/home/Newsletter.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection limit={8} />
      <FeaturedProducts />
      <PromotionalBanner />
      <DealsSection />
      <BestSellers />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}
