import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import useCart from '../hooks/useCart.js';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import EmptyCart from '../components/cart/EmptyCart.jsx';
import StockNotice from '../components/cart/StockNotice.jsx';
import Button from '../components/common/Button.jsx';

export default function Cart() {
  const { items, clearCart, count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Shopping Cart {count > 0 && <span className="text-lg font-semibold text-ink/40">({count} items)</span>}</h1>
      <StockNotice />
      {items.length === 0 ? (
        <div className="rounded-3xl bg-surface shadow-soft"><EmptyCart /></div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <ul className="space-y-3">{items.map((it) => <CartItem key={it.id} item={it} />)}</ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">← Continue shopping</Link>
              <button onClick={clearCart} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:underline"><Trash2 className="h-4 w-4" />Clear cart</button>
            </div>
          </div>
          <aside className="rounded-3xl bg-surface p-6 shadow-soft lg:sticky lg:top-24">
            <h2 className="mb-4 text-lg font-extrabold">Order Summary</h2>
            <CartSummary />
            <Button size="lg" className="mt-5 w-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
          </aside>
        </div>
      )}
    </div>
  );
}
