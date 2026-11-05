import Hero from '../components/home/Hero.jsx';
import CategorySection from '../components/home/CategorySection.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import PromotionalBanner from '../components/home/PromotionalBanner.jsx';
import DealsSection from '../components/home/DealsSection.jsx';
import BestSellers from '../components/home/BestSellers.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import Newsletter from '../components/home/Newsletter.jsx';
import useProducts from '../hooks/useProducts.js';

export default function Home() {
  const { products, loading } = useProducts();
  return (
    <>
      <Hero />
      <CategorySection limit={8} />
      {products.length === 0 && !loading && (
        <section className="container-page py-14">
          <div className="rounded-3xl bg-surface p-10 text-center shadow-soft">
            <p className="text-5xl" aria-hidden="true">🛒</p>
            <h2 className="mt-3 text-2xl font-extrabold">Products coming soon</h2>
            <p className="mt-1 text-ink/60">We are stocking the shelves. Please check back shortly!</p>
          </div>
        </section>
      )}
      <FeaturedProducts />
      <PromotionalBanner />
      <DealsSection />
      <BestSellers />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}
