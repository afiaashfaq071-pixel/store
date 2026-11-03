import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import StateIllustration from '../common/StateIllustration.jsx';

export default function ProductGrid({ products, columns = 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4', emptyMessage = 'No products found.' }) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-surface py-12 text-center shadow-soft">
        <StateIllustration icon={SearchX} />
        <p className="mt-4 font-bold">{emptyMessage}</p>
        <p className="text-sm text-ink/50">Try adjusting your filters or search.</p>
      </div>
    );
  }
  return (
    <div className={`grid gap-3 sm:gap-5 ${columns}`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
