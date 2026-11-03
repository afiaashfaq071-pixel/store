import { RotateCcw } from 'lucide-react';
import { defaultFilters } from '../../utils/productFilters.js';

const ratingOptions = [0, 4, 4.5];

/** Sidebar filter panel: category, brand, price range, rating, availability, offers. */
export default function ProductFilters({ filters, setFilters, brands, categories, showCategory = true, priceCeiling = 5000 }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const toggleBrand = (b) =>
    set({ brands: filters.brands.includes(b) ? filters.brands.filter((x) => x !== b) : [...filters.brands, b] });

  const reset = () => setFilters({ ...defaultFilters, category: showCategory ? 'all' : filters.category, sort: filters.sort });

  const section = 'border-t border-ink/10 pt-4';
  const heading = 'mb-3 text-xs font-bold uppercase tracking-widest text-ink/50';

  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold">Filters</h3>
        <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"><RotateCcw className="h-3 w-3" />Reset</button>
      </div>

      {showCategory && (
        <div>
          <p className={heading}>Category</p>
          <select value={filters.category} onChange={(e) => set({ category: e.target.value })} className="input-field !py-2.5" aria-label="Filter by category">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      )}

      <div className={section}>
        <p className={heading}>Price (PKR)</p>
        <div className="flex items-center gap-2">
          <input type="number" min="0" inputMode="numeric" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => set({ minPrice: Number(e.target.value) || 0 })} className="input-field !py-2" aria-label="Minimum price" />
          <span className="text-ink/40">–</span>
          <input type="number" min="0" inputMode="numeric" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => set({ maxPrice: Number(e.target.value) || 0 })} className="input-field !py-2" aria-label="Maximum price" />
        </div>
        <input
          type="range"
          min="0"
          max={priceCeiling}
          step="50"
          value={filters.maxPrice || priceCeiling}
          onChange={(e) => set({ maxPrice: Number(e.target.value) >= priceCeiling ? 0 : Number(e.target.value) })}
          className="mt-3 w-full accent-brand"
          aria-label="Maximum price slider"
        />
      </div>

      <div className={section}>
        <p className={heading}>Rating</p>
        <div className="space-y-1.5">
          {ratingOptions.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="rating" checked={filters.minRating === r} onChange={() => set({ minRating: r })} className="accent-brand" />
              {r === 0 ? 'All ratings' : `${r}★ & above`}
            </label>
          ))}
        </div>
      </div>

      <div className={section}>
        <p className={heading}>Availability & offers</p>
        <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={filters.inStockOnly} onChange={(e) => set({ inStockOnly: e.target.checked })} className="accent-brand" />In stock only</label>
        <label className="mt-1.5 flex cursor-pointer items-center gap-2"><input type="checkbox" checked={filters.onSale} onChange={(e) => set({ onSale: e.target.checked })} className="accent-brand" />On sale</label>
      </div>

      {brands.length > 0 && (
        <div className={section}>
          <p className={heading}>Brand</p>
          <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggleBrand(b)} className="accent-brand" />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
