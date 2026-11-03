import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts.js';
import ProductBrowser from '../components/products/ProductBrowser.jsx';

/** /shop — all products. Query params: q (search), deals=1, best=1, cat=<slug>. */
export default function Shop() {
  const { products } = useProducts();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const deals = params.has('deals');
  const best = params.has('best');
  const cat = params.get('cat') || 'all';

  const base = useMemo(() => {
    if (deals) return products.filter((p) => p.originalPrice);
    if (best) return products.filter((p) => p.bestSeller);
    return products;
  }, [products, deals, best]);

  const title = deals ? 'Deals & Offers' : best ? 'Best Sellers' : q ? `Results for “${q}”` : 'Shop All Products';
  const subtitle = deals ? 'Hand-picked discounts across every aisle.' : best ? 'The products our customers keep coming back for.' : 'Browse the full ALI HASSAN SUPERMART catalogue.';

  return (
    <div className="container-page py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-1 text-ink/60">{subtitle}</p>
      </header>
      <ProductBrowser key={params.toString()} baseProducts={base} initialFilters={{ query: q, category: cat }} />
    </div>
  );
}
