import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { formatPKR } from '../../utils/format.js';

const describe = (c) =>
  c.type === 'percent' ? `${c.value}% off` : c.type === 'flat' ? `${formatPKR(c.value)} off` : 'Free delivery';

export default function AdminDiscounts() {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useProducts();
  const { showToast } = useToast();
  const empty = { code: '', type: 'percent', value: '', minSubtotal: '', expiresOn: '', usageLimit: '' };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const code = form.code.trim().toUpperCase();
    const value = Number(form.value);
    if (!/^[A-Z0-9]{3,16}$/.test(code)) return setError('Code must be 3–16 letters or numbers.');
    if (form.type !== 'shipping' && !(value > 0)) return setError('Enter a discount value above 0.');
    if (form.type === 'percent' && value > 90) return setError('Percentage discount cannot exceed 90%.');
    if (form.minSubtotal !== '' && !(Number(form.minSubtotal) >= 0)) return setError('Minimum order must be 0 or more.');
    if (form.expiresOn && form.expiresOn < today) return setError('The expiry date cannot be in the past.');
    if (form.usageLimit !== '' && !(Number.isInteger(Number(form.usageLimit)) && Number(form.usageLimit) > 0)) return setError('Usage limit must be a whole number above 0.');
    const coupon = { code, type: form.type, value: form.type === 'shipping' ? 0 : value };
    coupon.label = describe(coupon);
    if (Number(form.minSubtotal) > 0) coupon.minSubtotal = Number(form.minSubtotal);
    // Valid until the end of the chosen day (local time).
    if (form.expiresOn) coupon.expiresAt = new Date(`${form.expiresOn}T23:59:59`).toISOString();
    if (form.usageLimit !== '') coupon.usageLimit = Number(form.usageLimit);
    setBusy(true);
    try {
      await addCoupon(coupon);
      setForm(empty);
      setError('');
      showToast(`Coupon ${code} saved`);
    } catch (err) {
      setError(`Could not save the coupon: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (code) => {
    try {
      await toggleCoupon(code);
    } catch (err) {
      showToast(`Could not update ${code}: ${err.message}`, 'error');
    }
  };

  const remove = async (code) => {
    if (!window.confirm(`Delete the coupon ${code}?`)) return;
    try {
      await deleteCoupon(code);
      showToast('Coupon deleted', 'info');
    } catch (err) {
      showToast(`Could not delete ${code}: ${err.message}`, 'error');
    }
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
      <div className="overflow-x-auto rounded-3xl bg-surface p-2 shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/40"><tr><th className="p-3">Code</th><th>Discount</th><th>Min. order</th><th>Expires</th><th>Used</th><th>Status</th><th /></tr></thead>
          <tbody className="divide-y divide-ink/5">
            {coupons.map((c) => (
              <tr key={c.code}>
                <td className="p-3 font-extrabold tracking-wide">{c.code}</td>
                <td>{describe(c)}</td>
                <td>{c.minSubtotal ? formatPKR(c.minSubtotal) : '—'}</td>
                <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-GB') : '—'}</td>
                <td>{c.usedCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                <td><button onClick={() => toggle(c.code)} aria-label={`Toggle ${c.code}`}><Badge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Active' : 'Disabled'}</Badge></button></td>
                <td className="pr-3 text-right"><button onClick={() => remove(c.code)} className="rounded-full p-2 text-red-500 hover:bg-red-500/10" aria-label={`Delete ${c.code}`}><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="p-8 text-center text-sm text-ink/50">No coupons yet.</p>}
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl bg-surface p-6 shadow-soft">
        <h2 className="font-extrabold">New coupon</h2>
        <div><label htmlFor="cp-code" className="mb-1 block text-sm font-semibold">Code</label><input id="cp-code" className="input-field uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="EID15" /></div>
        <div>
          <label htmlFor="cp-type" className="mb-1 block text-sm font-semibold">Type</label>
          <select id="cp-type" className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="percent">Percentage off</option><option value="flat">Flat amount off (PKR)</option><option value="shipping">Free delivery</option>
          </select>
        </div>
        {form.type !== 'shipping' && <div><label htmlFor="cp-val" className="mb-1 block text-sm font-semibold">{form.type === 'percent' ? 'Percent' : 'Amount (PKR)'}</label><input id="cp-val" type="number" min="0" className="input-field" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>}
        <div><label htmlFor="cp-min" className="mb-1 block text-sm font-semibold">Minimum order (optional)</label><input id="cp-min" type="number" min="0" className="input-field" value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} /></div>
        <div><label htmlFor="cp-exp" className="mb-1 block text-sm font-semibold">Expires on (optional)</label><input id="cp-exp" type="date" min={today} className="input-field" value={form.expiresOn} onChange={(e) => setForm({ ...form, expiresOn: e.target.value })} /></div>
        <div><label htmlFor="cp-lim" className="mb-1 block text-sm font-semibold">Usage limit (optional)</label><input id="cp-lim" type="number" min="1" step="1" className="input-field" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="e.g. 100 orders" /></div>
        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        <Button type="submit" icon={Plus} className="w-full" disabled={busy}>{busy ? 'Saving…' : 'Save coupon'}</Button>
      </form>
    </div>
  );
}
