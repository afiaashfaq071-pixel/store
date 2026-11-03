import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProductContext } from './ProductContext.jsx';
import { useToast } from './ToastContext.jsx';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../utils/format.js';

export const CartContext = createContext(null);

const CART_KEY = 'ahs_cart_v1';
const COUPON_KEY = 'ahs_cart_coupon_v1';

export function CartProvider({ children }) {
  const { products, coupons } = useContext(ProductContext);
  const { showToast } = useToast();

  // Only product id + quantity are stored; product details are resolved from the catalogue.
  const [items, setItems] = useState(() => loadFromStorage(CART_KEY, []));
  const [couponCode, setCouponCode] = useState(() => loadFromStorage(COUPON_KEY, null));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => saveToStorage(CART_KEY, items), [items]);
  useEffect(() => saveToStorage(COUPON_KEY, couponCode), [couponCode]);

  // Resolve lines against the catalogue (drops products that no longer exist).
  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.id === i.id);
          return product ? { ...product, qty: i.qty } : null;
        })
        .filter(Boolean),
    [items, products]
  );

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);

  const coupon = useMemo(() => {
    if (!couponCode) return null;
    const found = coupons.find((c) => c.code === couponCode && c.active);
    if (!found) return null;
    if (found.minSubtotal && subtotal < found.minSubtotal) return null;
    return found;
  }, [couponCode, coupons, subtotal]);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === 'flat') return Math.min(coupon.value, subtotal);
    return 0;
  }, [coupon, subtotal]);

  const deliveryFee = useMemo(() => {
    if (lines.length === 0) return 0;
    if (coupon?.type === 'shipping') return 0;
    return subtotal - discount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  }, [lines.length, coupon, subtotal, discount]);

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const addToCart = useCallback(
    (product, qty = 1) => {
      if (!product || product.stock <= 0) {
        showToast('Sorry, this item is out of stock', 'error');
        return false;
      }
      // Decide the outcome from current state (not inside the updater, which runs later).
      const current = items.find((i) => i.id === product.id)?.qty || 0;
      const capped = current + qty > product.stock;
      const nextQty = Math.min(current + qty, product.stock);
      setItems((prev) =>
        prev.some((i) => i.id === product.id)
          ? prev.map((i) => (i.id === product.id ? { ...i, qty: nextQty } : i))
          : [...prev, { id: product.id, qty: nextQty }]
      );
      showToast(capped ? `Max stock reached for ${product.name}` : `${product.name} added to cart`, capped ? 'info' : 'success');
      return true;
    },
    [items, showToast]
  );

  const removeFromCart = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  const updateQty = useCallback(
    (id, qty) => {
      const product = products.find((p) => p.id === id);
      const max = product ? product.stock : 99;
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, max) } : i))
      );
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
      if (!found || !found.active) return { ok: false, message: 'Invalid or expired coupon code' };
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
      updateQty,
      clearCart,
      getQty,
      applyCoupon,
      removeCoupon,
    }),
    [lines, count, subtotal, discount, deliveryFee, total, coupon, isOpen, addToCart, removeFromCart, updateQty, clearCart, getQty, applyCoupon, removeCoupon]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
