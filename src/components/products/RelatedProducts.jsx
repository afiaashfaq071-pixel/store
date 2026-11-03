import { useMemo } from 'react';
import useProducts from '../../hooks/useProducts.js';
import ProductGrid from './ProductGrid.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

export default function RelatedProducts({ product }) {
  const { products } = useProducts();
  const related = useMemo(
    () => products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    [products, product]
  );
  if (!related.length) return null;
  return (
    <section className="mt-16">
      <SectionHeading eyebrow="You may also like" title="Related Products" linkTo={`/category/${product.category}`} linkLabel="See category" />
      <ProductGrid products={related} columns="grid-cols-2 lg:grid-cols-4" />
    </section>
  );
}
