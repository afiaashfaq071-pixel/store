import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProductContext } from './ProductContext.jsx';
import { useToast } from './ToastContext.jsx';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';
import { computeTotals, resolveLines, sanitizeCartItems } from '../utils/cartMath.js';
import { sanitizeCouponCode } from '../utils/storedData.js';

export const CartContext = createContext(null);

const CART_KEY = 'ahs_cart_v1';
const COUPON_KEY = 'ahs_cart_coupon_v1';

export function CartProvider({ children }) {
  const { products, coupons, loading } = useContext(ProductContext);
  const { showToast } = useToast();

  // Only product id + quantity are stored; product details are resolved from the catalogue.
  const [items, setItems] = useState(() => sanitizeCartItems(loadFromStorage(CART_KEY, [])));
  const [couponCode, setCouponCode] = useState(() => sanitizeCouponCode(loadFromStorage(COUPON_KEY, null)));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveToStorage(CART_KEY, items);
  }, [items]);
  useEffect(() => {
    saveToStorage(COUPON_KEY, couponCode);
  }, [couponCode]);

  // Match the saved cart with the live catalogue. While products are still loading from the
  // database nothing is treated as unavailable, so a page refresh never empties the cart.
  const { lines, unavailable } = useMemo(() => {
    if (loading) return { lines: [], unavailable: [] };
    return resolveLines(items, products);
  }, [items, products, loading]);

  const selectedCoupon = useMemo(() => coupons.find((c) => c.code === couponCode) || null, [coupons, couponCode]);
  const totals = useMemo(() => computeTotals(lines, selectedCoupon), [lines, selectedCoupon]);
  const { count, subtotal, discount, deliveryFee, total, coupon } = totals;

  const addToCart = useCallback(
    (product, qty = 1) => {
      const amount = Math.floor(Number(qty));
      if (!product || !(amount > 0)) return false;
      if (product.stock <= 0) {
        showToast('Sorry, this item is out of stock', 'error');
        return false;
      }
      // Decide the outcome from current state (not inside the updater, which runs later).
      const current = items.find((i) => i.id === product.id)?.qty || 0;
      const capped = current + amount > product.stock;
      const nextQty = Math.min(current + amount, product.stock);
      setItems((prev) =>
        prev.some((i) => i.id === product.id)
          ? prev.map((i) => (i.id === product.id ? { ...i, qty: nextQty } : i))
          : [...prev, { id: product.id, qty: nextQty }]
      );
      showToast(capped ? `Only ${product.stock} of ${product.name} available` : `${product.name} added to cart`, capped ? 'info' : 'success');
      return true;
    },
    [items, showToast]
  );

  const removeFromCart = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  const removeUnavailable = useCallback(() => {
    const gone = new Set(unavailable.map((u) => u.id));
    setItems((prev) => prev.filter((i) => !gone.has(i.id)));
  }, [unavailable]);

  const updateQty = useCallback(
    (id, qty) => {
      const wanted = Math.floor(Number(qty));
      if (!Number.isFinite(wanted)) return;
      const product = products.find((p) => p.id === id);
      const max = product ? product.stock : 99;
      setItems((prev) => (wanted <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(wanted, max) } : i))));
    },
    [products]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
  }, []);

  const getQty = useCallback((id) => items.find((i) => i.id === id)?.qty || 0, [items]);

  const applyCoupon = useCallback(
    (raw) => {
      const code = (raw || '').trim().toUpperCase();
      if (!code) return { ok: false, message: 'Please enter a coupon code' };
      const found = coupons.find((c) => c.code === code);
      if (!found || !found.active) return { ok: false, message: 'Invalid coupon code' };
      if (found.expiresAt && new Date(found.expiresAt).getTime() <= Date.now()) return { ok: false, message: 'This coupon has expired' };
      if (found.usageLimit && (found.usedCount || 0) >= found.usageLimit) return { ok: false, message: 'This coupon has reached its usage limit' };
      if (found.minSubtotal && subtotal < found.minSubtotal)
        return { ok: false, message: `Minimum order Rs. ${found.minSubtotal.toLocaleString('en-PK')} required` };
      setCouponCode(code);
      showToast(`Coupon ${code} applied`, 'success');
      return { ok: true, message: `${found.label} applied` };
    },
    [coupons, subtotal, showToast]
  );

  const removeCoupon = useCallback(() => setCouponCode(null), []);

  const value = useMemo(
    () => ({
      items: lines,
      unavailable,
      count,
      subtotal,
      discount,
      deliveryFee,
      total,
      coupon,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      removeFromCart,
      removeUnavailable,
      updateQty,
      clearCart,
      getQty,
      applyCoupon,
      removeCoupon,
    }),
    [lines, unavailable, count, subtotal, discount, deliveryFee, total, coupon, isOpen, addToCart, removeFromCart, removeUnavailable, updateQty, clearCart, getQty, applyCoupon, removeCoupon]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
