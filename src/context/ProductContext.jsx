import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { products as seedProducts } from '../data/products.js';
import { categories as seedCategories } from '../data/categories.js';
import { coupons as seedCoupons } from '../data/banners.js';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

export const ProductContext = createContext(null);

const KEYS = {
  products: 'ahs_products_v2',
  categories: 'ahs_categories_v2',
  coupons: 'ahs_coupons_v1',
};

const seedCouponList = Object.entries(seedCoupons).map(([code, c]) => ({ code, active: true, ...c }));

/**
 * Catalogue state: products, categories and discount coupons.
 * Seeded from /src/data and persisted in LocalStorage so admin edits survive reloads.
 */
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => loadFromStorage(KEYS.products, seedProducts));
  const [categories, setCategories] = useState(() => loadFromStorage(KEYS.categories, seedCategories));
  const [coupons, setCoupons] = useState(() => loadFromStorage(KEYS.coupons, seedCouponList));

  useEffect(() => saveToStorage(KEYS.products, products), [products]);
  useEffect(() => saveToStorage(KEYS.categories, categories), [categories]);
  useEffect(() => saveToStorage(KEYS.coupons, coupons), [coupons]);

  const getProduct = useCallback((id) => products.find((p) => p.id === Number(id)), [products]);

  const addProduct = useCallback((data) => {
    setProducts((list) => {
      const nextId = list.reduce((m, p) => Math.max(m, p.id), 0) + 1;
      return [
        {
          emoji: '📦',
          tint: 'from-amber-500/20 to-orange-500/30',
          rating: 4.5,
          reviews: 0,
          popularity: 50,
          unit: '1 piece',
          description: `${data.name} by ${data.brand}.`,
          originalPrice: null,
          ...data,
          id: nextId,
          createdAt: Date.now(),
          featured: false,
          bestSeller: false,
        },
        ...list,
      ];
    });
  }, []);

  const updateProduct = useCallback((id, data) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((list) => list.filter((p) => p.id !== id));
  }, []);

  const addCategory = useCallback((data) => {
    setCategories((list) => [
      ...list,
      { emoji: '📦', tint: 'from-amber-500/20 to-orange-500/30', blurb: '', short: data.name, ...data },
    ]);
  }, []);

  const updateCategory = useCallback((slug, data) => {
    setCategories((list) => list.map((c) => (c.slug === slug ? { ...c, ...data } : c)));
  }, []);

  const deleteCategory = useCallback((slug) => {
    setCategories((list) => list.filter((c) => c.slug !== slug));
  }, []);

  const addCoupon = useCallback((coupon) => {
    setCoupons((list) => [...list.filter((c) => c.code !== coupon.code), { active: true, ...coupon }]);
  }, []);

  const toggleCoupon = useCallback((code) => {
    setCoupons((list) => list.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
  }, []);

  const deleteCoupon = useCallback((code) => {
    setCoupons((list) => list.filter((c) => c.code !== code));
  }, []);

  const resetCatalog = useCallback(() => {
    setProducts(seedProducts);
    setCategories(seedCategories);
    setCoupons(seedCouponList);
  }, []);

  const value = useMemo(
    () => ({
      products,
      categories,
      coupons,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addCoupon,
      toggleCoupon,
      deleteCoupon,
      resetCatalog,
    }),
    [products, categories, coupons, getProduct, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, addCoupon, toggleCoupon, deleteCoupon, resetCatalog]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
