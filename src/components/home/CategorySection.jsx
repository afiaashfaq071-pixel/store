import { useMemo } from 'react';
import useProducts from '../../hooks/useProducts.js';
import CategoryCard from '../categories/CategoryCard.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

export default function CategorySection({ limit, title = 'Shop by Category', showLink = true }) {
  const { categories, products } = useProducts();
  const counts = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);
  const list = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="container-page py-14">
      <SectionHeading eyebrow="Browse" title={title} subtitle="Twelve aisles, one friendly store." linkTo={showLink ? '/categories' : undefined} linkLabel="All categories" />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {list.map((c) => <CategoryCard key={c.slug} category={c} count={counts[c.slug] || 0} />)}
      </div>
    </section>
  );
}
