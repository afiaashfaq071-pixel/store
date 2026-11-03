import useOrders from '../../hooks/useOrders.js';
import { formatPKR } from '../../utils/format.js';

/** Customers are derived from orders (grouped by phone number). */
export default function AdminCustomers() {
  const { customers } = useOrders();
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/60">Customer records are built automatically from placed orders. There are no accounts or logins in this demo.</p>
      <div className="overflow-x-auto rounded-3xl bg-surface p-2 shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/40"><tr><th className="p-3">Customer</th><th>Phone</th><th>City</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead>
          <tbody className="divide-y divide-ink/5">
            {customers.map((c) => (
              <tr key={c.phone}>
                <td className="p-3 font-semibold">{c.name}</td><td>{c.phone}</td><td>{c.city}</td><td>{c.orders}</td><td className="font-bold">{formatPKR(c.spent)}</td>
                <td className="text-ink/60">{new Date(c.last).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="p-8 text-center text-sm text-ink/50">No customers yet.</p>}
      </div>
    </div>
  );
}
