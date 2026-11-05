// Safe readers for data saved in the browser (LocalStorage).
// Anything missing, damaged or of the wrong shape is dropped or replaced with a default, so a
// corrupted entry can never crash the site. Duplicates (same id / slug / code) are merged away.
import { ORDER_STATUSES } from './orderStatus.js';

const DEFAULT_TINT = 'from-amber-500/20 to-orange-500/30';
const COUPON_TYPES = ['percent', 'flat', 'shipping'];

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v, d = '') => (typeof v === 'string' ? v : d);
const num = (v, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

/** Valid products only; negative stock becomes 0; duplicate ids are removed. Falls back when not a list. */
export function sanitizeProducts(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const seen = new Set();
  const out = [];
  raw.forEach((p) => {
    if (!isObj(p)) return;
    const id = Math.floor(num(p.id, NaN));
    const name = str(p.name).trim();
    const price = num(p.price, NaN);
    if (!Number.isFinite(id) || id <= 0 || seen.has(id) || !name || !(price > 0)) return;
    seen.add(id);
    const stock = Math.floor(num(p.stock, 0));
    const original = num(p.originalPrice, NaN);
    out.push({
      ...p,
      id,
      name,
      price,
      stock: stock > 0 ? stock : 0,
      originalPrice: Number.isFinite(original) && original > price ? original : null,
      category: str(p.category),
      brand: str(p.brand).trim() || 'Ali Hassan Supermart',
      description: str(p.description).trim() || name,
      image: str(p.image),
      emoji: str(p.emoji) || '📦',
      unit: str(p.unit) || '1 piece',
      tint: str(p.tint) || DEFAULT_TINT,
      rating: num(p.rating, 4.5),
      reviews: Math.max(0, num(p.reviews, 0)),
      popularity: num(p.popularity, 50),
      featured: Boolean(p.featured),
      bestSeller: Boolean(p.bestSeller),
      sample: Boolean(p.sample),
      createdAt: num(p.createdAt, 0),
    });
  });
  return out;
}

export function sanitizeCategories(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const seen = new Set();
  const out = [];
  raw.forEach((c) => {
    if (!isObj(c)) return;
    const slug = str(c.slug).trim();
    const name = str(c.name).trim();
    if (!slug || !name || seen.has(slug)) return;
    seen.add(slug);
    out.push({ ...c, slug, name, short: str(c.short).trim() || name, emoji: str(c.emoji) || '📦', tint: str(c.tint) || DEFAULT_TINT, blurb: str(c.blurb) });
  });
  return out;
}

export function sanitizeCoupons(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const seen = new Set();
  const out = [];
  raw.forEach((c) => {
    if (!isObj(c)) return;
    const code = str(c.code).trim().toUpperCase();
    if (!code || seen.has(code) || !COUPON_TYPES.includes(c.type)) return;
    const value = num(c.value, NaN);
    if (!Number.isFinite(value) || value < 0) return;
    const expiresAt = typeof c.expiresAt === 'string' && Number.isFinite(new Date(c.expiresAt).getTime()) ? c.expiresAt : null;
    const limit = Math.floor(num(c.usageLimit, 0));
    seen.add(code);
    out.push({
      ...c,
      code,
      value,
      active: c.active !== false,
      label: str(c.label),
      expiresAt,
      usageLimit: limit > 0 ? limit : null,
      usedCount: Math.max(0, Math.floor(num(c.usedCount, 0))),
    });
  });
  return out;
}

/** Valid orders only. Old status names are mapped ("Shipped" is now "Out for Delivery"); unknown ones become Pending. */
export function sanitizeOrders(raw, fallback) {
  if (!Array.isArray(raw)) return fallback;
  const seen = new Set();
  const out = [];
  raw.forEach((o) => {
    if (!isObj(o) || !isObj(o.customer) || !Array.isArray(o.items)) return;
    const id = str(o.id).trim();
    if (!id || seen.has(id)) return;
    const items = o.items
      .filter((i) => isObj(i) && num(i.qty, 0) > 0 && num(i.price, -1) >= 0)
      .map((i) => ({ ...i, id: num(i.id, 0), name: str(i.name, 'Item'), qty: Math.floor(num(i.qty, 1)), price: num(i.price, 0) }));
    if (items.length === 0) return;
    seen.add(id);
    const subtotal = num(o.subtotal, items.reduce((s, i) => s + i.price * i.qty, 0));
    const discount = Math.max(0, num(o.discount, 0));
    const deliveryFee = Math.max(0, num(o.deliveryFee, 0));
    const status = o.status === 'Shipped' ? 'Out for Delivery' : ORDER_STATUSES.includes(o.status) ? o.status : 'Pending';
    out.push({
      ...o,
      id,
      customer: { ...o.customer, name: str(o.customer.name), phone: str(o.customer.phone), city: str(o.customer.city), address: str(o.customer.address) },
      items,
      subtotal,
      discount,
      deliveryFee,
      total: num(o.total, Math.max(0, subtotal - discount + deliveryFee)),
      status,
      createdAt: num(o.createdAt, Date.now()),
      followUpSent: Boolean(o.followUpSent),
      stockRestored: Boolean(o.stockRestored),
    });
  });
  return out;
}

/** A list of unique whole product ids (wishlist). */
export function sanitizeIds(raw) {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map((v) => Math.floor(num(v, NaN))).filter((n) => Number.isFinite(n) && n > 0))];
}

export function sanitizeOwnerContact(raw) {
  if (!isObj(raw)) return { phone: '', email: '' };
  return { phone: str(raw.phone).trim(), email: str(raw.email).trim() };
}

export const sanitizeCouponCode = (raw) => (typeof raw === 'string' && raw.trim() ? raw.trim().toUpperCase() : null);
