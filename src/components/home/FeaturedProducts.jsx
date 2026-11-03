import { useMemo } from 'react';
import useProducts from '../../hooks/useProducts.js';
import ProductGrid from '../products/ProductGrid.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

export default function FeaturedProducts() {
  const { products } = useProducts();
  const featured = useMemo(() => products.filter((p) => p.featured && p.stock > 0).sort((a, b) => b.popularity - a.popularity).slice(0, 8), [products]);
  return (
    <section className="container-page py-14">
      <SectionHeading eyebrow="Handpicked" title="Featured Products" subtitle="Our top picks this week." linkTo="/shop" linkLabel="Shop all" />
      <ProductGrid products={featured} columns="grid-cols-2 lg:grid-cols-4" />
    </section>
  );
}
