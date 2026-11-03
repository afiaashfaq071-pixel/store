import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Tag, Store } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import useDebounce from '../../hooks/useDebounce.js';
import { formatPKR } from '../../utils/format.js';
import ProductImage from '../common/ProductImage.jsx';

/**
 * Live search with suggestions for products, categories and brands.
 * Enter / "See all results" goes to /shop?q=…
 */
export default function ProductSearch({ autoFocus = false, onNavigate, className = '' }) {
  const { products, categories } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const debounced = useDebounce(query, 150);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (q.length < 1) return null;
    const prods = products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 5);
    const cats = categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3);
    const brands = [...new Set(products.map((p) => p.brand))].filter((b) => b.toLowerCase().includes(q)).slice(0, 3);
    return { prods, cats, brands };
  }, [debounced, products, categories]);

  useEffect(() => {
    const close = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = (path) => {
    setOpen(false);
    setQuery('');
    navigate(path);
    onNavigate?.();
  };

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) go(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const empty = results && !results.prods.length && !results.cats.length && !results.brands.length;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search">
        <label htmlFor="site-search" className="sr-only">Search products</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          id="site-search"
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search groceries, brands, categories…"
          className="w-full rounded-full border border-ink/10 bg-surface py-3 pl-11 pr-10 text-sm shadow-sm placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 hover:bg-ink/5" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && results && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-ink/5 bg-surface p-2 shadow-lift">
          {empty && <p className="px-3 py-6 text-center text-sm text-ink/50">No matches for “{debounced}”. Try another word.</p>}

          {results.cats.length > 0 && (
            <div className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">Categories</p>
              {results.cats.map((c) => (
                <button key={c.slug} onClick={() => go(`/category/${c.slug}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-cream">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="font-medium">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {results.brands.length > 0 && (
            <div className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">Brands</p>
              {results.brands.map((b) => (
                <button key={b} onClick={() => go(`/shop?q=${encodeURIComponent(b)}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-cream">
                  <Store className="h-4 w-4 text-brand" />
                  <span className="font-medium">{b}</span>
                </button>
              ))}
            </div>
          )}

          {results.prods.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">Products</p>
              {results.prods.map((p) => (
                <button key={p.id} onClick={() => go(`/product/${p.id}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-cream">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage product={p} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-ink/50">{p.brand}</p>
                  </div>
                  <span className="text-sm font-bold text-brand">{formatPKR(p.price)}</span>
                </button>
              ))}
            </div>
          )}

          {!empty && (
            <button onClick={() => go(`/shop?q=${encodeURIComponent(query.trim())}`)} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-3 py-2.5 text-sm font-semibold text-white hover:bg-charcoal-700">
              <Tag className="h-4 w-4" /> See all results for “{query.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
