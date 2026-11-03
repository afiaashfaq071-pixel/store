import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/** Category tile with live product count. */
export default function CategoryCard({ category, count }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${category.tint}`}
      style={{ minHeight: '10.5rem' }}
    >
      <span className="text-5xl drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">{category.emoji}</span>
      <div className="relative">
        <h3 className="text-base font-extrabold leading-tight">{category.short || category.name}</h3>
        <p className="mt-0.5 flex items-center justify-between text-xs font-medium text-ink/60">
          {count} products
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-white transition group-hover:bg-brand"><ArrowUpRight className="h-4 w-4" /></span>
        </p>
      </div>
    </Link>
  );
}
