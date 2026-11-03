import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import Badge from '../../components/common/Badge.jsx';

const FILTERS = [['all', 'All'], ['low', 'Low (≤10)'], ['out', 'Out of stock']];

/** Quick stock adjustments without opening the full product form. */
export default function AdminStock() {
  const { products, updateProduct } = useProducts();
  const [filter, setFilter] = useState('all');

  const list = useMemo(
    () => products.filter((p) => (filter === 'out' ? p.stock === 0 : filter === 'low' ? p.stock <= 10 : true)).sort((a, b) => a.stock - b.stock),
    [products, filter]
  );

  const adjust = (p, delta) => updateProduct(p.id, { stock: Math.max(0, p.stock + delta) });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === key ? 'bg-brand text-white' : 'bg-surface shadow-sm hover:bg-ink/5'}`}>{label}</button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-3xl bg-surface p-2 shadow-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/40"><tr><th className="p-3">Product</th><th>Status</th><th className="text-right pr-3">Stock</th></tr></thead>
          <tbody className="divide-y divide-ink/5">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="p-3"><span className="mr-2 text-xl">{p.emoji}</span><span className="font-semibold">{p.name}</span></td>
                <td><Badge tone={p.stock === 0 ? 'danger' : p.stock <= 10 ? 'gold' : 'success'}>{p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? 'Low stock' : 'In stock'}</Badge></td>
                <td className="pr-3">
                  <div className="ml-auto flex w-fit items-center gap-1">
                    <button onClick={() => adjust(p, -10)} className="rounded-full px-2 py-1 text-xs font-bold hover:bg-ink/5" aria-label={`Remove 10 from ${p.name}`}>−10</button>
                    <button onClick={() => adjust(p, -1)} className="rounded-full p-1.5 hover:bg-ink/5" aria-label={`Decrease stock of ${p.name}`}><Minus className="h-4 w-4" /></button>
                    <input
                      type="number"
                      min="0"
                      value={p.stock}
                      onChange={(e) => updateProduct(p.id, { stock: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
                      className="w-16 rounded-lg border border-ink/15 py-1 text-center font-bold"
                      aria-label={`Stock of ${p.name}`}
                    />
                    <button onClick={() => adjust(p, 1)} className="rounded-full p-1.5 hover:bg-ink/5" aria-label={`Increase stock of ${p.name}`}><Plus className="h-4 w-4" /></button>
                    <button onClick={() => adjust(p, 10)} className="rounded-full px-2 py-1 text-xs font-bold hover:bg-ink/5" aria-label={`Add 10 to ${p.name}`}>+10</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-8 text-center text-sm text-ink/50">Nothing here — great!</p>}
      </div>
    </div>
  );
}
