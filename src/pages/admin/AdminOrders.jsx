import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import useOrders from '../../hooks/useOrders.js';
import { useToast } from '../../context/ToastContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatPKR } from '../../utils/format.js';
import { statusTone } from '../../utils/adminStats.js';
import { ORDER_STATUSES, allowedNext } from '../../utils/orderStatus.js';

export default function AdminOrders() {
  const { orders, loading, error, updateOrderStatus, refreshOrders } = useOrders();
  const { showToast } = useToast();
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c = { All: orders.length };
    ORDER_STATUSES.forEach((s) => {
      c[s] = orders.filter((o) => o.status === s).length;
    });
    return c;
  }, [orders]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'All' && o.status !== filter) return false;
      if (!q) return true;
      return [o.id, o.customer.name, o.customer.phone, o.customer.city].some((s) => String(s || '').toLowerCase().includes(q));
    });
  }, [orders, filter, query]);

  const change = (o, status) => {
    if (status === 'Cancelled' && !window.confirm(`Cancel order ${o.id}? The stock will be put back and this cannot be undone.`)) return;
    const res = updateOrderStatus(o.id, status);
    showToast(res.message, res.ok ? 'info' : 'error');
  };

  return (
    <div className="space-y-5">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order no., name, phone or city…" className="input-field pl-9" aria-label="Search orders" />
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...ORDER_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === s ? 'bg-brand text-white' : 'bg-surface shadow-sm hover:bg-ink/5'}`}>
            {s} <span className="opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm" role="alert">
          <span className="flex-1 text-red-400">{error}</span>
          <Button size="sm" variant="outline" onClick={refreshOrders}>Try again</Button>
        </div>
      )}

      {loading && orders.length === 0 ? (
        <Loader label="Loading orders…" />
      ) : (
        <ul className="space-y-3">
          {list.map((o) => {
            const next = allowedNext(o.status);
            return (
              <li key={o.id} className="rounded-2xl bg-surface shadow-soft">
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={open === o.id}>
                    {open === o.id ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                    <span className="min-w-0">
                      <span className="block font-extrabold">{o.id}</span>
                      <span className="block truncate text-xs text-ink/50">{o.customer.name} · {o.customer.city} · {new Date(o.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </span>
                  </button>
                  <span className="font-bold">{formatPKR(o.total)}</span>
                  <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                  {next.length > 0 ? (
                    <select value="" onChange={(e) => e.target.value && change(o, e.target.value)} className="rounded-full border border-ink/15 bg-surface px-3 py-1.5 text-xs font-semibold" aria-label={`Change status of ${o.id}`}>
                      <option value="">Move to…</option>
                      {next.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span className="text-xs text-ink/40">Final</span>
                  )}
                </div>
                {open === o.id && (
                  <div className="grid gap-4 border-t border-ink/10 p-4 text-sm md:grid-cols-2">
                    <div>
                      <p className="font-bold">Customer</p>
                      <p>{o.customer.name}</p><p className="text-ink/60">{o.customer.phone}</p>
                      <p className="text-ink/60">{o.customer.address}, {o.customer.city}</p>
                      {o.customer.notes && <p className="mt-1 text-xs italic text-ink/50">Note: {o.customer.notes}</p>}
                    </div>
                    <div>
                      <p className="font-bold">Items</p>
                      <ul>{o.items.map((i, idx) => <li key={`${i.id}-${idx}`} className="flex justify-between gap-3"><span>{i.name} × {i.qty}</span><span>{formatPKR(i.price * i.qty)}</span></li>)}</ul>
                      <div className="mt-2 space-y-0.5 border-t border-dashed border-ink/20 pt-2 text-ink/70">
                        <p className="flex justify-between"><span>Subtotal</span>{formatPKR(o.subtotal)}</p>
                        {o.discount > 0 && <p className="flex justify-between"><span>Discount{o.coupon ? ` (${o.coupon})` : ''}</span>− {formatPKR(o.discount)}</p>}
                        <p className="flex justify-between"><span>Delivery</span>{o.deliveryFee ? formatPKR(o.deliveryFee) : 'Free'}</p>
                        <p className="flex justify-between font-extrabold text-ink"><span>Total (COD)</span>{formatPKR(o.total)}</p>
                      </div>
                      {o.status === 'Cancelled' && o.stockRestored && <p className="mt-2 text-xs text-success-dark">Stock for this order was put back.</p>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {list.length === 0 && <li className="rounded-2xl bg-surface p-8 text-center text-sm text-ink/50 shadow-soft">{orders.length === 0 ? 'No orders yet.' : 'No orders match your search or filter.'}</li>}
        </ul>
      )}
    </div>
  );
}
