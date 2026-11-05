import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url).pathname.replace(/\/$/, '');
const { sanitizeCartItems, resolveLines, computeTotals, usableCoupon } = await import(root + '/src/utils/cartMath.js');
const { canTransition, allowedNext, ORDER_STATUSES } = await import(root + '/src/utils/orderStatus.js');
const { matchesQuery, filterProducts, defaultFilters } = await import(root + '/src/utils/productFilters.js');
const { lastNDaysRevenue, topProducts } = await import(root + '/src/utils/adminStats.js');
const { sanitizeCoupons } = await import(root + '/src/utils/storedData.js');
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok  -', name); };

const P = (id, price, stock, extra = {}) => ({ id, name: 'Item ' + id, brand: 'B', category: 'grocery', price, stock, rating: 4, popularity: 1, createdAt: id, ...extra });
const products = [P(1, 1000, 5), P(2, 500, 0), P(3, 2000, 3, { name: 'Premium Tea Leaves 950g', brand: 'Tapal', category: 'grocery' })];

t('sanitize merges duplicates and drops bad rows', () => {
  assert.deepEqual(sanitizeCartItems([{ id: 1, qty: 1 }, { id: 1, qty: 2 }, { id: 'x', qty: 1 }, { id: 2, qty: 0 }, { id: 3, qty: -4 }, { id: 4, qty: 2.7 }, null]), [{ id: 1, qty: 3 }, { id: 4, qty: 2 }]);
  assert.deepEqual(sanitizeCartItems('junk'), []);
});
t('quantity is limited to stock', () => {
  const { lines } = resolveLines([{ id: 1, qty: 99 }], products);
  assert.equal(lines[0].qty, 5);
});
t('out-of-stock and removed products are flagged, not charged', () => {
  const r = resolveLines([{ id: 2, qty: 1 }, { id: 9, qty: 1 }, { id: 1, qty: 1 }], products);
  assert.equal(r.unavailable.length, 2); assert.equal(r.lines.length, 1);
});
t('subtotal + delivery fee below free-delivery threshold', () => {
  const r = computeTotals(resolveLines([{ id: 1, qty: 2 }], products).lines, null);
  assert.equal(r.subtotal, 2000); assert.equal(r.deliveryFee, 199); assert.equal(r.total, 2199);
});
t('free delivery at Rs. 3000 exactly', () => {
  const r = computeTotals(resolveLines([{ id: 1, qty: 3 }], products).lines, null);
  assert.equal(r.subtotal, 3000); assert.equal(r.deliveryFee, 0); assert.equal(r.total, 3000);
});
t('percent coupon rounds and can lose free delivery', () => {
  const c = { code: 'W', type: 'percent', value: 10, active: true };
  const r = computeTotals(resolveLines([{ id: 1, qty: 3 }], products).lines, c);
  assert.equal(r.discount, 300); assert.equal(r.subtotal - r.discount, 2700); assert.equal(r.deliveryFee, 199); assert.equal(r.total, 2899);
});
t('flat coupon respects minimum and never exceeds subtotal', () => {
  const c = { code: 'S', type: 'flat', value: 200, minSubtotal: 2000, active: true };
  assert.equal(computeTotals(resolveLines([{ id: 1, qty: 1 }], products).lines, c).discount, 0);
  assert.equal(computeTotals(resolveLines([{ id: 1, qty: 2 }], products).lines, c).discount, 200);
  assert.equal(computeTotals([{ price: 100, qty: 1 }], { type: 'flat', value: 500, active: true }).total, 199 - 0 + 0);
});
t('shipping coupon and disabled coupon', () => {
  const lines = resolveLines([{ id: 1, qty: 1 }], products).lines;
  assert.equal(computeTotals(lines, { type: 'shipping', value: 0, active: true }).deliveryFee, 0);
  assert.equal(computeTotals(lines, { type: 'percent', value: 50, active: false }).discount, 0);
});
t('empty cart totals are zero', () => {
  const r = computeTotals([], null); assert.deepEqual([r.subtotal, r.deliveryFee, r.total, r.count], [0, 0, 0, 0]);
});
t('order status transitions', () => {
  assert.deepEqual(ORDER_STATUSES, ['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled']);
  assert.ok(canTransition('Pending', 'Confirmed')); assert.ok(canTransition('Processing', 'Out for Delivery')); assert.ok(canTransition('Out for Delivery', 'Delivered')); assert.ok(canTransition('Out for Delivery', 'Cancelled')); assert.ok(canTransition('Confirmed', 'Cancelled'));
  assert.ok(!canTransition('Processing', 'Delivered'));
  assert.ok(!canTransition('Pending', 'Delivered')); assert.ok(!canTransition('Delivered', 'Cancelled')); assert.ok(!canTransition('Cancelled', 'Pending'));
  assert.deepEqual(allowedNext('Delivered'), []);
});
t('search: partial, case-insensitive, any word order, brand and category', () => {
  const p = products[2];
  assert.ok(matchesQuery(p, 'tea')); assert.ok(matchesQuery(p, 'TEA LEAV')); assert.ok(matchesQuery(p, 'leaves tea')); assert.ok(matchesQuery(p, 'tapal'));
  assert.ok(matchesQuery(p, 'Grocery', 'Grocery & Staples')); assert.ok(!matchesQuery(p, 'coffee')); assert.ok(matchesQuery(p, '   '));
});
t('search + category + stock filters work together; clearing restores all', () => {
  const all = [P(1, 100, 5, { category: 'a', name: 'Red Tea' }), P(2, 100, 0, { category: 'a', name: 'Green Tea' }), P(3, 100, 5, { category: 'b', name: 'Tea Cup' })];
  const f = (patch) => filterProducts(all, { ...defaultFilters, ...patch }, []).map((p) => p.id).sort();
  assert.deepEqual(f({ query: 'tea', category: 'a' }), [1, 2]);
  assert.deepEqual(f({ query: 'tea', category: 'a', inStockOnly: true }), [1]);
  assert.deepEqual(f({ query: 'zzz' }), []);
  assert.deepEqual(f({ query: '' }), [1, 2, 3]);
});
t('dashboard stats ignore cancelled orders', () => {
  const now = Date.now();
  const orders = [{ status: 'Delivered', total: 1000, createdAt: now, items: [{ id: 1, name: 'A', qty: 2, price: 500 }] }, { status: 'Cancelled', total: 9999, createdAt: now, items: [{ id: 1, name: 'A', qty: 9, price: 500 }] }];
  assert.equal(lastNDaysRevenue(orders, 7).reduce((s, d) => s + d.value, 0), 1000);
  assert.equal(topProducts(orders)[0].qty, 2);
});
t('expired and used-up coupons are not usable', () => {
  const base = { code: 'TEST10', type: 'percent', value: 10, active: true };
  assert.ok(usableCoupon(base, 1000));
  assert.equal(usableCoupon({ ...base, expiresAt: new Date(Date.now() - 1000).toISOString() }, 1000), null);
  assert.ok(usableCoupon({ ...base, expiresAt: new Date(Date.now() + 86400000).toISOString() }, 1000));
  assert.equal(usableCoupon({ ...base, usageLimit: 2, usedCount: 2 }, 1000), null);
  assert.ok(usableCoupon({ ...base, usageLimit: 2, usedCount: 1 }, 1000));
});
t('stored coupons: bad expiry and limits are cleaned', () => {
  const [c] = sanitizeCoupons([{ code: 'abc12', type: 'flat', value: 50, expiresAt: 'nonsense', usageLimit: -3, usedCount: -1 }]);
  assert.equal(c.expiresAt, null);
  assert.equal(c.usageLimit, null);
  assert.equal(c.usedCount, 0);
});
console.log(`\n${n} logic tests passed`);
