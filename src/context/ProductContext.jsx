import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { products as seedProducts } from '../data/products.js';
import { categories as seedCategories } from '../data/categories.js';
import { coupons as seedCoupons } from '../data/banners.js';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';
import { sanitizeCategories, sanitizeCoupons, sanitizeProducts } from '../utils/storedData.js';
import { api, isSupabaseEnabled } from '../lib/supabase.js';
import { useToast } from './ToastContext.jsx';

export const ProductContext = createContext(null);

const KEYS = {
  products: 'ahs_products_v3',
  categories: 'ahs_categories_v2',
  coupons: 'ahs_coupons_v1',
};

const DEFAULT_TINT = 'from-amber-500/20 to-orange-500/30';
const seedCouponList = Object.entries(seedCoupons).map(([code, c]) => ({ code, active: true, ...c }));

// ---- database <-> app field names -------------------------------------------------------
const FIELD_MAP = {
  name: 'name', brand: 'brand', category: 'category', price: 'price', originalPrice: 'original_price', stock: 'stock',
  description: 'description', image: 'image', emoji: 'emoji', unit: 'unit', tint: 'tint', rating: 'rating',
  reviews: 'reviews', popularity: 'popularity', featured: 'featured', bestSeller: 'best_seller',
};

const toRow = (data) =>
  Object.fromEntries(Object.entries(data).filter(([k]) => FIELD_MAP[k]).map(([k, v]) => [FIELD_MAP[k], v]));

const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  brand: r.brand || 'Ali Hassan Supermart',
  category: r.category,
  price: Number(r.price),
  originalPrice: r.original_price == null ? null : Number(r.original_price),
  stock: Number(r.stock) || 0,
  description: r.description || r.name,
  image: r.image || '',
  emoji: r.emoji || '📦',
  unit: r.unit || '1 piece',
  tint: r.tint || DEFAULT_TINT,
  rating: Number(r.rating ?? 4.5),
  reviews: Number(r.reviews ?? 0),
  popularity: Number(r.popularity ?? 50),
  featured: Boolean(r.featured),
  bestSeller: Boolean(r.best_seller),
  sample: false,
  createdAt: new Date(r.created_at).getTime(),
});

const couponFromRow = (r) => ({
  code: r.code,
  type: r.type,
  value: Number(r.value),
  minSubtotal: r.min_subtotal == null ? undefined : Number(r.min_subtotal),
  label: r.label || '',
  active: Boolean(r.active),
  expiresAt: r.expires_at || null,
  usageLimit: r.usage_limit == null ? null : Number(r.usage_limit),
  usedCount: Number(r.used_count) || 0,
});

// used_count is maintained by the database itself, never written from the browser.
const couponToRow = (c) => ({
  code: c.code,
  type: c.type,
  value: c.value,
  min_subtotal: c.minSubtotal || null,
  label: c.label || '',
  active: c.active !== false,
  expires_at: c.expiresAt || null,
  usage_limit: c.usageLimit || null,
});

const categoryFromRow = (r) => ({
  slug: r.slug,
  name: r.name,
  short: r.short || r.name,
  emoji: r.emoji || '📦',
  tint: r.tint || DEFAULT_TINT,
  blurb: r.blurb || '',
});

const categoryToRow = (c, sortOrder) => ({
  slug: c.slug,
  name: c.name,
  short: c.short || c.name,
  emoji: c.emoji || '📦',
  tint: c.tint || DEFAULT_TINT,
  blurb: c.blurb || '',
  ...(sortOrder === undefined ? {} : { sort_order: sortOrder }),
});

/** Turns a database error into a short message for the admin (e.g. duplicate name, category still in use). */
const friendly = (err) => {
  const m = String((err && err.message) || err || '');
  if (/duplicate key|already exists|unique/i.test(m)) return 'That name or code already exists.';
  if (/foreign key|still referenced|violates/i.test(m)) return 'It is still used by products — move or delete those first.';
  return m || 'Unknown database error.';
};

/** Keeps price/stock changes sane (no negative stock, no zero or negative price). */
const cleanProductChanges = (data) => {
  const next = { ...data };
  if ('stock' in next) next.stock = Math.max(0, Math.floor(Number(next.stock) || 0));
  if ('price' in next) {
    const price = Number(next.price);
    if (price > 0) next.price = price;
    else delete next.price;
  }
  return next;
};

/**
 * Catalogue state: products, categories and discount coupons.
 * Products come from the Supabase database when it is configured; otherwise they are seeded from
 * /src/data and kept in this browser's LocalStorage. Categories and coupons follow the same rule (database table or LocalStorage).
 */
export function ProductProvider({ children }) {
  const { showToast } = useToast();
  const [products, setProducts] = useState(() => (isSupabaseEnabled ? [] : sanitizeProducts(loadFromStorage(KEYS.products, null), seedProducts)));
  const [loading, setLoading] = useState(isSupabaseEnabled);
  const [categories, setCategories] = useState(() => (isSupabaseEnabled ? [] : sanitizeCategories(loadFromStorage(KEYS.categories, null), seedCategories)));
  const [categoriesLoading, setCategoriesLoading] = useState(isSupabaseEnabled);
  const [coupons, setCoupons] = useState(() => (isSupabaseEnabled ? [] : sanitizeCoupons(loadFromStorage(KEYS.coupons, null), seedCouponList)));
  const pending = useRef(new Map()); // product id -> { data, timer } (database saves are batched)

  useEffect(() => {
    if (isSupabaseEnabled) return;
    if (!saveToStorage(KEYS.products, products)) {
      showToast('Browser storage is full — remove a few items or use smaller photos.', 'error');
    }
  }, [products, showToast]);
  useEffect(() => {
    if (!isSupabaseEnabled) saveToStorage(KEYS.categories, categories);
  }, [categories]);
  useEffect(() => {
    if (!isSupabaseEnabled) saveToStorage(KEYS.coupons, coupons);
  }, [coupons]);

  const refreshProducts = useCallback(async () => {
    if (!isSupabaseEnabled) return;
    try {
      const rows = await api('products?select=*&order=created_at.desc');
      setProducts((rows || []).map(fromRow));
    } catch {
      showToast('Could not load products from the database.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // With the database on, categories and coupons live in their own tables (the server re-checks
  // coupons on every order, so the website never decides a discount by itself).
  useEffect(() => {
    if (!isSupabaseEnabled) return;
    api('categories?select=*&order=sort_order,created_at')
      .then((rows) => setCategories((rows || []).map(categoryFromRow)))
      .catch((err) => showToast(`Could not load categories: ${friendly(err)}`, 'error'))
      .finally(() => setCategoriesLoading(false));
    api('coupons?select=*&order=code')
      .then((rows) => setCoupons((rows || []).map(couponFromRow)))
      .catch((err) => showToast(`Could not load coupons: ${friendly(err)}`, 'error'));
  }, [showToast]);

  const getProduct = useCallback((id) => products.find((p) => p.id === Number(id)), [products]);

  const addProduct = useCallback(async (data) => {
    const extras = { brand: 'Ali Hassan Supermart', emoji: '📦', unit: '1 piece', description: data.name, originalPrice: null };
    if (isSupabaseEnabled) {
      const rows = await api('products', { method: 'POST', body: toRow({ ...extras, ...data }), prefer: 'return=representation' });
      const created = fromRow(rows[0]);
      setProducts((list) => [created, ...list]);
      return created;
    }
    setProducts((list) => {
      const nextId = list.reduce((m, p) => Math.max(m, p.id), 0) + 1;
      return [
        {
          tint: DEFAULT_TINT,
          rating: 4.5,
          reviews: 0,
          popularity: 50,
          ...extras,
          ...data,
          id: nextId,
          createdAt: Date.now(),
          sample: false,
          featured: false,
          bestSeller: false,
        },
        ...list,
      ];
    });
    return null;
  }, []);

  const updateProduct = useCallback(
    (id, rawData) => {
      const data = cleanProductChanges(rawData);
      setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));
      if (!isSupabaseEnabled) return;
      // Save to the database shortly after the last change (typing a stock number fires many updates).
      const entry = pending.current.get(id) || { data: {}, timer: null };
      entry.data = { ...entry.data, ...data };
      clearTimeout(entry.timer);
      entry.timer = setTimeout(() => {
        pending.current.delete(id);
        api(`products?id=eq.${id}`, { method: 'PATCH', body: toRow(entry.data) }).catch(() => showToast('Could not save the change to the database.', 'error'));
      }, 500);
      pending.current.set(id, entry);
    },
    [showToast]
  );

  const deleteProduct = useCallback(async (id) => {
    if (isSupabaseEnabled) await api(`products?id=eq.${id}`, { method: 'DELETE' });
    setProducts((list) => list.filter((p) => p.id !== id));
  }, []);

  /** Deletes every demo product in one go (items the owner added are kept). */
  const removeSampleProducts = useCallback(() => {
    setProducts((list) => list.filter((p) => !p.sample));
  }, []);

  // Categories, coupons: with the database on, the change is saved first and the screen only changes
  // after the database accepted it (so a failure is never shown as a success). Each function resolves
  // when done and throws an Error with a readable message when it failed.
  const addCategory = useCallback(
    async (data) => {
      const base = { emoji: '📦', tint: DEFAULT_TINT, blurb: '', short: data.name, ...data };
      if (isSupabaseEnabled) {
        const order = categories.reduce((m, c, i) => Math.max(m, i + 1), 0) + 1;
        try {
          const rows = await api('categories', { method: 'POST', body: categoryToRow(base, order), prefer: 'return=representation' });
          setCategories((list) => [...list, categoryFromRow(rows[0])]);
        } catch (err) {
          throw new Error(friendly(err));
        }
        return;
      }
      if (categories.some((c) => c.slug === base.slug || c.name.toLowerCase() === base.name.toLowerCase())) throw new Error('That name or code already exists.');
      setCategories((list) => [...list, base]);
    },
    [categories]
  );

  const updateCategory = useCallback(async (slug, data) => {
    if (isSupabaseEnabled) {
      try {
        await api(`categories?slug=eq.${encodeURIComponent(slug)}`, { method: 'PATCH', body: categoryToRow({ slug, ...data }) });
      } catch (err) {
        throw new Error(friendly(err));
      }
    }
    setCategories((list) => list.map((c) => (c.slug === slug ? { ...c, ...data } : c)));
  }, []);

  const deleteCategory = useCallback(async (slug) => {
    if (isSupabaseEnabled) {
      try {
        await api(`categories?slug=eq.${encodeURIComponent(slug)}`, { method: 'DELETE' });
      } catch (err) {
        throw new Error(friendly(err));
      }
    }
    setCategories((list) => list.filter((c) => c.slug !== slug));
  }, []);

  const addCoupon = useCallback(async (coupon) => {
    const full = { active: true, usedCount: 0, ...coupon };
    if (isSupabaseEnabled) {
      try {
        const rows = await api('coupons?on_conflict=code', { method: 'POST', body: couponToRow(full), prefer: 'resolution=merge-duplicates,return=representation' });
        const saved = couponFromRow(rows[0]);
        setCoupons((list) => [...list.filter((c) => c.code !== saved.code), saved].sort((x, y) => x.code.localeCompare(y.code)));
      } catch (err) {
        throw new Error(friendly(err));
      }
      return;
    }
    setCoupons((list) => [...list.filter((c) => c.code !== full.code), full]);
  }, []);

  const toggleCoupon = useCallback(
    async (code) => {
      const current = coupons.find((c) => c.code === code);
      if (!current) throw new Error('Coupon not found.');
      if (isSupabaseEnabled) {
        try {
          await api(`coupons?code=eq.${encodeURIComponent(code)}`, { method: 'PATCH', body: { active: !current.active } });
        } catch (err) {
          throw new Error(friendly(err));
        }
      }
      setCoupons((list) => list.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
    },
    [coupons]
  );

  const deleteCoupon = useCallback(async (code) => {
    if (isSupabaseEnabled) {
      try {
        await api(`coupons?code=eq.${encodeURIComponent(code)}`, { method: 'DELETE' });
      } catch (err) {
        throw new Error(friendly(err));
      }
    }
    setCoupons((list) => list.filter((c) => c.code !== code));
  }, []);

  /** Browser-only demo: count (+1) or give back (-1) one use of a coupon. The database does this itself. */
  const adjustCouponUseLocal = useCallback((code, direction) => {
    if (isSupabaseEnabled || !code) return;
    setCoupons((list) => list.map((c) => (c.code === code ? { ...c, usedCount: Math.max(0, (c.usedCount || 0) + direction) } : c)));
  }, []);

  /**
   * Browser-only stock change used when there is no database (the database does this itself):
   * direction -1 takes items out of stock for a new order, +1 puts them back after a cancellation.
   */
  const adjustStockLocal = useCallback((orderItems, direction) => {
    setProducts((list) =>
      list.map((p) => {
        const qty = orderItems.filter((i) => i.id === p.id).reduce((n, i) => n + i.qty, 0);
        return qty ? { ...p, stock: Math.max(0, p.stock + direction * qty) } : p;
      })
    );
  }, []);

  /** Demo mode only: puts the sample products, categories and coupons back. Does nothing with a database. */
  const resetCatalog = useCallback(() => {
    if (isSupabaseEnabled) return; // with a database these are managed there
    setProducts(seedProducts);
    setCoupons(seedCouponList);
    setCategories(seedCategories);
  }, []);

  const value = useMemo(
    () => ({
      products,
      categories,
      coupons,
      loading,
      categoriesLoading,
      getProduct,
      refreshProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      removeSampleProducts,
      adjustStockLocal,
      adjustCouponUseLocal,
      addCategory,
      updateCategory,
      deleteCategory,
      addCoupon,
      toggleCoupon,
      deleteCoupon,
      resetCatalog,
    }),
    [products, categories, coupons, loading, categoriesLoading, getProduct, refreshProducts, addProduct, updateProduct, deleteProduct, removeSampleProducts, adjustStockLocal, adjustCouponUseLocal, addCategory, updateCategory, deleteCategory, addCoupon, toggleCoupon, deleteCoupon, resetCatalog]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
