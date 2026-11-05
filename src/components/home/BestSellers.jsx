import { useMemo } from 'react';
import useProducts from '../../hooks/useProducts.js';
import ProductGrid from '../products/ProductGrid.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

export default function BestSellers() {
  const { products } = useProducts();
  const best = useMemo(() => products.filter((p) => p.bestSeller).sort((a, b) => b.popularity - a.popularity).slice(0, 8), [products]);
  if (best.length === 0) return null;
  return (
    <section className="container-page py-14">
      <SectionHeading eyebrow="Popular" title="Best Sellers" subtitle="The favourites our customers keep coming back for." linkTo="/shop?best=1" />
      <ProductGrid products={best} columns="grid-cols-2 lg:grid-cols-4" />
    </section>
  );
}
