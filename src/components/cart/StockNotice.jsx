import { AlertTriangle } from 'lucide-react';
import useCart from '../../hooks/useCart.js';

/** Warns when cart items sold out (or were removed from the store) and lets the customer clear them. */
export default function StockNotice() {
  const { unavailable, removeUnavailable } = useCart();
  if (unavailable.length === 0) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm" role="alert">
      <AlertTriangle className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
      <p className="min-w-0 flex-1">
        <b>{unavailable.length === 1 ? 'An item in your cart is' : `${unavailable.length} items in your cart are`} no longer available:</b>{' '}
        {unavailable.map((u) => u.name).join(', ')}. They are not included in your total.
      </p>
      <button type="button" onClick={removeUnavailable} className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal hover:bg-gold-dark">Remove them</button>
    </div>
  );
}
