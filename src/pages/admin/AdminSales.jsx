import { useMemo } from 'react';
import { Banknote, Receipt, TrendingUp } from 'lucide-react';
import useOrders from '../../hooks/useOrders.js';
import useProducts from '../../hooks/useProducts.js';
import StatCard from '../../components/admin/StatCard.jsx';
import BarChart from '../../components/admin/BarChart.jsx';
import { formatPKR } from '../../utils/format.js';
import { lastNDaysRevenue, revenueByCategory, topProducts } from '../../utils/adminStats.js';

export default function AdminSales() {
  const { orders } = useOrders();
  const { products, categories } = useProducts();

  const valid = useMemo(() => orders.filter((o) => o.status !== 'Cancelled'), [orders]);
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const avg = valid.length ? revenue / valid.length : 0;
  const unitsSold = valid.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0);
  const daily = useMemo(() => lastNDaysRevenue(orders, 14), [orders]);
  const top = useMemo(() => topProducts(orders, 5), [orders]);
  const byCat = useMemo(() => revenueByCategory(orders, products, categories), [orders, products, categories]);
  const maxCat = Math.max(...byCat.map((c) => c.value), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Banknote} label="Total sales" value={formatPKR(revenue)} />
        <StatCard icon={Receipt} label="Avg. order value" value={formatPKR(avg)} tone="bg-sky-500/15 text-sky-300" />
        <StatCard icon={TrendingUp} label="Units sold" value={unitsSold} tone="bg-success/15 text-success-dark" />
      </div>

      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h2 className="mb-5 font-extrabold">Daily revenue — last 14 days</h2>
        <BarChart data={daily.map((d, i) => ({ ...d, label: i % 2 === 0 ? d.label : '' }))} height={200} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h2 className="mb-4 font-extrabold">Top products</h2>
          {top.length === 0 ? <p className="text-sm text-ink/50">No sales yet.</p> : (
            <ol className="space-y-3 text-sm">
              {top.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-extrabold text-brand">{i + 1}</span><span className="flex-1 truncate font-semibold">{p.name}</span><span className="text-ink/50">{p.qty} sold</span><span className="font-bold">{formatPKR(p.revenue)}</span></li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h2 className="mb-4 font-extrabold">Revenue by category</h2>
          {byCat.length === 0 ? <p className="text-sm text-ink/50">No sales yet.</p> : (
            <ul className="space-y-3 text-sm">
              {byCat.map((c) => (
                <li key={c.label}>
                  <div className="mb-1 flex justify-between"><span className="font-semibold">{c.label}</span><span>{formatPKR(c.value)}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/5"><div className="h-full rounded-full bg-gradient-to-r from-brand to-gold" style={{ width: `${(c.value / maxCat) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
