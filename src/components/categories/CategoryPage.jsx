import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import ProductBrowser from '../products/ProductBrowser.jsx';

/** Header + product listing for a single category. */
export default function CategoryPage({ category }) {
  const { products, categories } = useProducts();
  const items = useMemo(() => products.filter((p) => p.category === category.slug), [products, category.slug]);
  const others = categories.filter((c) => c.slug !== category.slug).slice(0, 6);

  return (
    <div className="container-page py-8">
      <nav className="mb-4 flex items-center gap-1 text-xs text-ink/50" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand">Home</Link><ChevronRight className="h-3 w-3" />
        <Link to="/categories" className="hover:text-brand">Categories</Link><ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-ink">{category.short || category.name}</span>
      </nav>

      <header className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br p-6 sm:p-10 ${category.tint}`}>
        <span className="text-6xl drop-shadow-md">{category.emoji}</span>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-xl text-ink/70">{category.blurb}</p>
        <p className="mt-3 inline-block rounded-full bg-surface/70 px-3 py-1 text-xs font-bold">{items.length} products</p>
      </header>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {others.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="shrink-0 rounded-full border border-ink/10 bg-surface px-4 py-2 text-xs font-semibold hover:border-brand hover:text-brand">
            {c.emoji} {c.short || c.name}
          </Link>
        ))}
      </div>

      <ProductBrowser key={category.slug} baseProducts={items} showCategoryFilter={false} initialFilters={{ category: category.slug }} emptyMessage="No products in this category yet." />
    </div>
  );
}
