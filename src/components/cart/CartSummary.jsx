import { useState } from 'react';
import { Check, TicketPercent, X } from 'lucide-react';
import useCart from '../../hooks/useCart.js';
import { FREE_DELIVERY_THRESHOLD, formatPKR } from '../../utils/format.js';

/** Subtotal / coupon / delivery / total block. Reused by the drawer, cart page and checkout. */
export default function CartSummary({ allowCoupon = true }) {
  const { subtotal, discount, deliveryFee, total, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const res = applyCoupon(code);
    setFeedback(res);
    if (res.ok) setCode('');
  };

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - (subtotal - discount));
  const progress = Math.min(100, ((subtotal - discount) / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="space-y-4">
      {subtotal > 0 && (
        <div className="rounded-xl bg-cream p-3">
          <p className="text-xs font-semibold">
            {remaining > 0 ? <>Add <span className="text-brand">{formatPKR(remaining)}</span> more for <b>free delivery</b></> : '🎉 You unlocked free delivery!'}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {allowCoupon && (
        <div>
          {coupon ? (
            <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 font-semibold text-success-dark"><Check className="h-4 w-4" />{coupon.code} — {coupon.label}</span>
              <button onClick={removeCoupon} className="rounded-full p-1 hover:bg-surface" aria-label="Remove coupon"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex gap-2">
              <div className="relative flex-1">
                <TicketPercent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try WELCOME10)" className="input-field !py-2.5 pl-9" aria-label="Coupon code" />
              </div>
              <button type="submit" className="rounded-xl bg-charcoal px-4 text-sm font-semibold text-white hover:bg-charcoal-700">Apply</button>
            </form>
          )}
          {feedback && !coupon && <p className={`mt-1.5 text-xs ${feedback.ok ? 'text-success-dark' : 'text-red-500'}`}>{feedback.message}</p>}
        </div>
      )}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="font-semibold">{formatPKR(subtotal)}</dd></div>
        {discount > 0 && <div className="flex justify-between text-success-dark"><dt>Coupon discount</dt><dd className="font-semibold">− {formatPKR(discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-ink/60">Delivery</dt><dd className="font-semibold">{deliveryFee === 0 ? <span className="text-success-dark">FREE</span> : formatPKR(deliveryFee)}</dd></div>
        <div className="flex justify-between border-t border-dashed border-ink/15 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-brand" data-testid="cart-total">{formatPKR(total)}</dd></div>
      </dl>
    </div>
  );
}
