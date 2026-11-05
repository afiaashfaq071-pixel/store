// Pure cart helpers (no React) so the money maths can be tested on its own.
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from './format.js';

/**
 * Cleans the cart saved in the browser: keeps only { id, qty } pairs with a valid whole quantity
 * and merges duplicate product ids into one line.
 */
export function sanitizeCartItems(raw) {
  if (!Array.isArray(raw)) return [];
  const merged = new Map();
  raw.forEach((entry) => {
    const id = Number(entry && entry.id);
    const qty = Math.floor(Number(entry && entry.qty));
    if (!Number.isFinite(id) || !(qty > 0)) return;
    merged.set(id, (merged.get(id) || 0) + qty);
  });
  return [...merged.entries()].map(([id, qty]) => ({ id, qty }));
}

/**
 * Matches cart entries with the live catalogue.
 * - `lines`: products that can be bought, with qty limited to the stock available.
 * - `unavailable`: products that are out of stock or no longer exist (not counted in totals).
 */
export function resolveLines(items, products) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = [];
  const unavailable = [];
  items.forEach((i) => {
    const product = byId.get(i.id);
    if (!product) {
      unavailable.push({ id: i.id, name: 'An item that was removed from the store' });
    } else if (!(product.stock > 0)) {
      unavailable.push({ id: product.id, name: product.name });
    } else {
      lines.push({ ...product, qty: Math.min(i.qty, product.stock) });
    }
  });
  return { lines, unavailable };
}

/** Is this coupon usable for the given subtotal? Returns the coupon or null. */
export function usableCoupon(coupon, subtotal) {
  if (!coupon || !coupon.active) return null;
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() <= Date.now()) return null;
  if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return null;
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return null;
  return coupon;
}

/** Subtotal, discount, delivery fee and total for a list of lines and an (optional) coupon. */
export function computeTotals(lines, coupon) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const valid = usableCoupon(coupon, subtotal);

  let discount = 0;
  if (valid && valid.type === 'percent') discount = Math.round((subtotal * valid.value) / 100);
  if (valid && valid.type === 'flat') discount = Math.min(valid.value, subtotal);

  let deliveryFee = DELIVERY_FEE;
  if (lines.length === 0) deliveryFee = 0;
  else if (valid && valid.type === 'shipping') deliveryFee = 0;
  else if (subtotal - discount >= FREE_DELIVERY_THRESHOLD) deliveryFee = 0;

  return { subtotal, count, discount, deliveryFee, total: Math.max(0, subtotal - discount + deliveryFee), coupon: valid };
}
