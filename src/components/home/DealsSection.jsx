import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import ProductGrid from '../products/ProductGrid.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { BadgePercent } from 'lucide-react';
import { getDiscountPercent } from '../../data/products.js';

export default function DealsSection() {
  const { products } = useProducts();
  const deals = useMemo(
    () => products.filter((p) => p.originalPrice && p.stock > 0).sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a)).slice(0, 4),
    [products]
  );
  return (
    <section className="bg-charcoal py-14 text-white">
      <div className="container-page">
        <div className="relative mb-8 flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-brand to-gold p-6 text-charcoal sm:p-8">
          <div className="relative z-10 max-w-lg">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3 py-1 text-xs font-bold text-gold"><Flame className="h-3.5 w-3.5" />Limited time</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl">Special Deals & Offers</h2>
            <p className="mt-2 text-sm font-medium sm:text-base">Use code <b className="rounded bg-white/70 px-1.5">WELCOME10</b> for an extra 10% off your first order.</p>
            <Link to="/shop?deals=1" className="mt-4 inline-block rounded-full bg-charcoal px-5 py-2.5 text-sm font-bold text-white hover:bg-charcoal-700">See all deals</Link>
          </div>
          <BadgePercent className="absolute -right-4 -top-4 hidden h-56 w-56 -rotate-12 text-charcoal/15 sm:block md:right-8" strokeWidth={1.25} aria-hidden="true" />
        </div>
        <div className="[&_article]:text-ink">
          <ProductGrid products={deals} columns="grid-cols-2 lg:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}
