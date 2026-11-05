import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Banknote, CheckCircle2, Clock, Package, ShoppingBag } from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import BarChart from '../../components/admin/BarChart.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import useOrders from '../../hooks/useOrders.js';
import useProducts from '../../hooks/useProducts.js';
import { formatPKR } from '../../utils/format.js';
import { lastNDaysRevenue, statusTone } from '../../utils/adminStats.js';
import { isSupabaseEnabled } from '../../lib/supabase.js';

export default function Dashboard() {
  const { orders, customers, loading, error, refreshOrders } = useOrders();
  const { products } = useProducts();

  const revenue = useMemo(() => orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0), [orders]);
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const completed = orders.filter((o) => o.status === 'Delivered').length;
  const lowStock = products.filter((p) => p.stock <= 10);
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const chart = useMemo(() => lastNDaysRevenue(orders, 7), [orders]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm" role="alert">
          <span className="flex-1 text-red-400">{error}</span>
          <Button size="sm" variant="outline" onClick={refreshOrders}>Try again</Button>
        </div>
      )}
      {loading && orders.length === 0 && <Loader label="Loading dashboard…" />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Banknote} label={isSupabaseEnabled ? 'Total sales' : 'Total demo sales'} value={formatPKR(revenue)} hint="All orders except cancelled" />
        <StatCard icon={ShoppingBag} label="Total orders" value={orders.length} hint={`${customers.length} customer${customers.length === 1 ? '' : 's'}`} tone="bg-sky-500/15 text-sky-300" />
        <StatCard icon={Clock} label="Pending orders" value={pending} hint="Waiting to be confirmed" tone="bg-gold/20 text-gold" />
        <StatCard icon={CheckCircle2} label="Completed orders" value={completed} hint="Delivered" tone="bg-success/15 text-success-dark" />
        <StatCard icon={Package} label="Total products" value={products.length} hint={`${totalUnits.toLocaleString('en-PK')} units in stock`} tone="bg-violet-500/15 text-violet-300" />
        <StatCard icon={AlertTriangle} label="Low-stock products" value={lowStock.length} hint="10 or fewer left (including out of stock)" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl bg-surface p-6 shadow-soft xl:col-span-2">
          <h2 className="mb-5 font-extrabold">Revenue — last 7 days</h2>
          <BarChart data={chart} />
        </section>

        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-extrabold"><AlertTriangle className="h-5 w-5 text-brand" />Low stock alerts</h2>
          {lowStock.length === 0 ? <p className="text-sm text-ink/50">All products are well stocked.</p> : (
            <ul className="space-y-2 text-sm">
              {lowStock.slice(0, 7).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2"><span className="truncate">{p.emoji} {p.name}</span><Badge tone={p.stock === 0 ? 'danger' : 'gold'}>{p.stock === 0 ? 'Out' : p.stock}</Badge></li>
              ))}
            </ul>
          )}
          <Link to="/admin/stock" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">Manage stock →</Link>
        </section>
      </div>

      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-extrabold">Recent orders</h2><Link to="/admin/orders" className="text-sm font-semibold text-brand hover:underline">View all →</Link></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink/40"><tr><th className="pb-3">Order</th><th className="pb-3">Customer</th><th className="pb-3">Total</th><th className="pb-3">Status</th></tr></thead>
            <tbody className="divide-y divide-ink/5">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}><td className="py-3 font-semibold">{o.id}</td><td>{o.customer.name}</td><td>{formatPKR(o.total)}</td><td><Badge tone={statusTone(o.status)}>{o.status}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
