// Pure helpers for search / filter / sort so UI components stay thin.
export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export const defaultFilters = {
  query: '',
  category: 'all',
  brands: [],
  minPrice: 0,
  maxPrice: 0, // 0 = no upper limit
  minRating: 0,
  inStockOnly: false,
  onSale: false,
  sort: 'popular',
};

/**
 * Partial, case-insensitive search. Every word typed must appear somewhere in the product name,
 * brand or category, so "tea leav" and "leaves tea" both find "Premium Tea Leaves".
 */
export function matchesQuery(product, query, categoryName = '') {
  const words = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [product.name, product.brand, categoryName].map((s) => String(s || '').toLowerCase()).join(' ');
  return words.every((w) => haystack.includes(w));
}

export function filterProducts(products, filters, categories = []) {
  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || '';
  let list = products.filter((p) => {
    if (!matchesQuery(p, filters.query, catName(p.category))) return false;
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (p.price < filters.minPrice) return false;
    if (filters.maxPrice > 0 && p.price > filters.maxPrice) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (filters.onSale && !p.originalPrice) return false;
    return true;
  });

  const sorters = {
    popular: (a, b) => b.popularity - a.popularity,
    newest: (a, b) => b.createdAt - a.createdAt,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  list = [...list].sort(sorters[filters.sort] || sorters.popular);
  return list;
}
