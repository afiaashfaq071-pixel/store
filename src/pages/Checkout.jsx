import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Info, Wallet } from 'lucide-react';
import useCart from '../hooks/useCart.js';
import useOrders from '../hooks/useOrders.js';
import CartSummary from '../components/cart/CartSummary.jsx';
import EmptyCart from '../components/cart/EmptyCart.jsx';
import Button from '../components/common/Button.jsx';
import StateIllustration from '../components/common/StateIllustration.jsx';
import ProductImage from '../components/common/ProductImage.jsx';
import { formatPKR } from '../utils/format.js';

const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Other'];
const phoneRe = /^(\+92|0)?3\d{2}[- ]?\d{7}$/;

export default function Checkout() {
  const cart = useCart();
  const { placeOrder } = useOrders();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: 'Lahore', notes: '' });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Please enter your full name';
    if (!phoneRe.test(form.phone.trim())) e.phone = 'Enter a valid Pakistani mobile number, e.g. 0300-1234567';
    if (form.address.trim().length < 10) e.address = 'Please enter your complete delivery address';
    if (!form.city) e.city = 'Select your city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const record = placeOrder({
      customer: { name: form.name.trim(), phone: form.phone.trim(), city: form.city, address: form.address.trim(), notes: form.notes.trim() },
      items: cart.items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, emoji: i.emoji, tint: i.tint })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      coupon: cart.coupon?.code || null,
      payment: 'Cash on Delivery',
    });
    cart.clearCart();
    setOrder(record);
    window.scrollTo({ top: 0 });
  };

  /* ---------- Confirmation screen ---------- */
  if (order) {
    return (
      <div className="container-page py-10">
        <div className="mx-auto max-w-2xl rounded-3xl bg-surface p-6 text-center shadow-soft sm:p-10">
          <StateIllustration icon={CheckCircle2} tone="success" className="mx-auto" />
          <h1 className="mt-3 text-3xl font-extrabold">Order placed!</h1>
          <p className="mt-2 text-ink/70">Thank you, <b>{order.customer.name}</b>. Your order <b className="text-brand">{order.id}</b> has been recorded.</p>

          <div className="mt-6 rounded-2xl bg-cream p-5 text-left text-sm">
            <p className="font-bold">Delivering to</p>
            <p className="text-ink/70">{order.customer.address}, {order.customer.city}, Pakistan</p>
            <p className="text-ink/70">Phone: {order.customer.phone}</p>
            <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3"><span>{i.name} × {i.qty}</span><span className="font-semibold">{formatPKR(i.price * i.qty)}</span></li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-dashed border-ink/20 pt-3 text-base font-extrabold"><span>Total (Cash on Delivery)</span><span className="text-brand">{formatPKR(order.total)}</span></div>
          </div>

          <p className="mt-5 flex items-start gap-2 rounded-xl bg-gold/20 p-3 text-left text-xs text-ink/70">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            This is a demo storefront. The order is saved only in this browser (visible in the Admin Dashboard) — no real order, payment or delivery is processed.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/shop">Continue Shopping</Button>
            <Button to="/admin/orders" variant="outline">View in Admin</Button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-10">
        <div className="mx-auto max-w-lg rounded-3xl bg-surface shadow-soft"><EmptyCart title="Nothing to check out yet" text="Add a few items to your cart first." /></div>
      </div>
    );
  }

  const field = 'input-field';
  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-500" role="alert">{errors[k]}</p>;

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
      <form onSubmit={submit} noValidate className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-surface p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-extrabold">Delivery details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Full name</label>
                <input id="name" className={field} value={form.name} onChange={set('name')} placeholder="e.g. Ali Hassan" autoComplete="name" aria-invalid={!!errors.name} />
                {err('name')}
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">Phone number</label>
                <input id="phone" className={field} value={form.phone} onChange={set('phone')} placeholder="0300-1234567" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
                {err('phone')}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block text-sm font-semibold">Complete address</label>
                <textarea id="address" rows={3} className={field} value={form.address} onChange={set('address')} placeholder="House / flat no., street, area, landmark" autoComplete="street-address" aria-invalid={!!errors.address} />
                {err('address')}
              </div>
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-semibold">City</label>
                <select id="city" className={field} value={form.city} onChange={set('city')}>{cities.map((c) => <option key={c}>{c}</option>)}</select>
                {err('city')}
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-semibold">Country</label>
                <input id="country" className={`${field} bg-ink/5`} value="Pakistan" readOnly />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold">Order notes <span className="font-normal text-ink/40">(optional)</span></label>
                <input id="notes" className={field} value={form.notes} onChange={set('notes')} placeholder="Delivery instructions…" />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-surface p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-extrabold">Payment method</h2>
            <label className="flex items-center gap-4 rounded-2xl border-2 border-brand bg-brand/5 p-4">
              <input type="radio" checked readOnly className="accent-brand" />
              <Wallet className="h-6 w-6 text-brand" />
              <span>
                <span className="block font-bold">Cash on Delivery</span>
                <span className="text-xs text-ink/60">Pay in cash (PKR) when your order arrives.</span>
              </span>
            </label>
          </section>
        </div>

        <aside className="rounded-3xl bg-surface p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-extrabold">Order summary</h2>
          <ul className="mb-5 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"><ProductImage product={i} size="sm" /></div>
                <span className="min-w-0 flex-1"><span className="line-clamp-1 font-semibold">{i.name}</span><span className="text-xs text-ink/50">Qty {i.qty}</span></span>
                <span className="font-bold">{formatPKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <CartSummary />
          <Button type="submit" size="lg" className="mt-5 w-full">Place Order · {formatPKR(cart.total)}</Button>
          <Link to="/cart" className="mt-3 block text-center text-sm font-semibold text-brand hover:underline">← Edit cart</Link>
        </aside>
      </form>
    </div>
  );
}
