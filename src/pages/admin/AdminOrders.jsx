import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useOrders from '../../hooks/useOrders.js';
import { ORDER_STATUSES } from '../../context/OrderContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import { formatPKR } from '../../utils/format.js';
import { statusTone } from '../../utils/adminStats.js';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('All');

  const list = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  const change = (o, status) => {
    updateOrderStatus(o.id, status);
    showToast(`${o.id} marked ${status}`, 'info');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {['All', ...ORDER_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === s ? 'bg-brand text-white' : 'bg-surface shadow-sm hover:bg-ink/5'}`}>{s}</button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((o) => (
          <li key={o.id} className="rounded-2xl bg-surface shadow-soft">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex flex-1 items-center gap-3 text-left" aria-expanded={open === o.id}>
                {open === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span>
                  <span className="block font-extrabold">{o.id}</span>
                  <span className="text-xs text-ink/50">{o.customer.name} · {o.customer.city} · {new Date(o.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </span>
              </button>
              <span className="font-bold">{formatPKR(o.total)}</span>
              <Badge tone={statusTone(o.status)}>{o.status}</Badge>
              <select value={o.status} onChange={(e) => change(o, e.target.value)} className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold" aria-label={`Change status of ${o.id}`}>
                {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
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
                  <ul>{o.items.map((i) => <li key={i.id + i.name} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{formatPKR(i.price * i.qty)}</span></li>)}</ul>
                  <div className="mt-2 space-y-0.5 border-t border-dashed border-ink/20 pt-2 text-ink/70">
                    <p className="flex justify-between"><span>Subtotal</span>{formatPKR(o.subtotal)}</p>
                    {o.discount > 0 && <p className="flex justify-between"><span>Discount</span>− {formatPKR(o.discount)}</p>}
                    <p className="flex justify-between"><span>Delivery</span>{o.deliveryFee ? formatPKR(o.deliveryFee) : 'Free'}</p>
                    <p className="flex justify-between font-extrabold text-ink"><span>Total (COD)</span>{formatPKR(o.total)}</p>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
        {list.length === 0 && <li className="rounded-2xl bg-surface p-8 text-center text-sm text-ink/50 shadow-soft">No orders with this status.</li>}
      </ul>
    </div>
  );
}
