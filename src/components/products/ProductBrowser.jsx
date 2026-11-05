import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import ProductFilters from './ProductFilters.jsx';
import ProductGrid from './ProductGrid.jsx';
import { SORT_OPTIONS, defaultFilters, filterProducts } from '../../utils/productFilters.js';

/**
 * Shared listing UI (filters + sort + grid) used by the Shop page and every Category page.
 * `baseProducts` is the pre-scoped list (e.g. only one category, only deals).
 */
export default function ProductBrowser({ baseProducts, initialFilters = {}, showCategoryFilter = true, emptyMessage }) {
  const { categories } = useProducts();
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters });
  const [panelOpen, setPanelOpen] = useState(false);

  const brands = useMemo(() => [...new Set(baseProducts.map((p) => p.brand))].sort(), [baseProducts]);
  const priceCeiling = useMemo(() => Math.max(500, Math.ceil(Math.max(...baseProducts.map((p) => p.price), 0) / 500) * 500), [baseProducts]);
  const results = useMemo(() => filterProducts(baseProducts, filters, categories), [baseProducts, filters, categories]);

  const panel = (
    <ProductFilters filters={filters} setFilters={setFilters} brands={brands} categories={categories} showCategory={showCategoryFilter} priceCeiling={priceCeiling} />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden h-fit rounded-3xl bg-surface p-5 shadow-soft lg:sticky lg:top-24 lg:block">{panel}</aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/60"><span className="font-bold text-ink">{results.length}</span> product{results.length === 1 ? '' : 's'} found{filters.query && <> for “{filters.query}”</>}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPanelOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-4 py-2.5 text-sm font-semibold lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <label className="sr-only" htmlFor="sort">Sort products</label>
            <select id="sort" value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))} className="rounded-full border border-ink/15 bg-surface px-4 py-2.5 text-sm font-semibold focus:border-brand focus:outline-none">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <ProductGrid products={results} columns="grid-cols-2 md:grid-cols-3" emptyMessage={baseProducts.length === 0 ? 'Products coming soon.' : emptyMessage} hint={baseProducts.length === 0 ? 'New items are being added — please check back soon.' : undefined} />
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setPanelOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface p-5 pb-24">
            <button onClick={() => setPanelOpen(false)} className="absolute right-4 top-4 rounded-full bg-ink/5 p-2" aria-label="Close filters"><X className="h-5 w-5" /></button>
            {panel}
            <button onClick={() => setPanelOpen(false)} className="fixed inset-x-5 bottom-5 rounded-full bg-brand py-3.5 text-sm font-bold text-white shadow-lift">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
