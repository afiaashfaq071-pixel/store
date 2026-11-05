import { useMemo } from 'react';
import useProducts from '../../hooks/useProducts.js';
import ProductGrid from '../products/ProductGrid.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

export default function FeaturedProducts() {
  const { products } = useProducts();
  // Featured items first; if none are flagged (e.g. only owner-added items), show the newest in stock.
  const featured = useMemo(() => {
    const picks = products.filter((p) => p.featured && p.stock > 0).sort((a, b) => b.popularity - a.popularity);
    const list = picks.length ? picks : products.filter((p) => p.stock > 0).sort((a, b) => b.createdAt - a.createdAt);
    return list.slice(0, 8);
  }, [products]);
  if (featured.length === 0) return null;
  return (
    <section className="container-page py-14">
      <SectionHeading eyebrow="Handpicked" title="Featured Products" subtitle="Our top picks this week." linkTo="/shop" linkLabel="Shop all" />
      <ProductGrid products={featured} columns="grid-cols-2 lg:grid-cols-4" />
    </section>
  );
}
