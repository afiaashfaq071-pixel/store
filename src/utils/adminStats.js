// Helpers that turn raw orders into dashboard numbers.
export const statusTone = (status) =>
  ({ Pending: 'gold', Confirmed: 'info', Processing: 'dark', 'Out for Delivery': 'brand', Delivered: 'success', Cancelled: 'danger' }[status] || 'neutral');

const DAY = 86400000;

export function lastNDaysRevenue(orders, n = 7) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days = Array.from({ length: n }, (_, i) => {
    const d = new Date(startOfToday.getTime() - (n - 1 - i) * DAY);
    return { start: d.getTime(), label: d.toLocaleDateString('en-GB', { weekday: 'short' }), value: 0 };
  });
  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    const slot = days.find((d) => o.createdAt >= d.start && o.createdAt < d.start + DAY);
    if (slot) slot.value += o.total;
  });
  return days;
}

export function topProducts(orders, limit = 5) {
  const map = new Map();
  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    o.items.forEach((i) => {
      const prev = map.get(i.id) || { id: i.id, name: i.name, qty: 0, revenue: 0 };
      prev.qty += i.qty;
      prev.revenue += i.qty * i.price;
      map.set(i.id, prev);
    });
  });
  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export function revenueByCategory(orders, products, categories) {
  const catOf = new Map(products.map((p) => [p.id, p.category]));
  const totals = new Map();
  orders.forEach((o) => {
    if (o.status === 'Cancelled') return;
    o.items.forEach((i) => {
      const cat = catOf.get(i.id);
      if (cat) totals.set(cat, (totals.get(cat) || 0) + i.qty * i.price);
    });
  });
  return categories
    .map((c) => ({ label: c.short || c.name, value: totals.get(c.slug) || 0 }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
}
