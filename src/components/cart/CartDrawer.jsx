import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import useCart from '../../hooks/useCart.js';
import CartItem from './CartItem.jsx';
import CartSummary from './CartSummary.jsx';
import EmptyCart from './EmptyCart.jsx';
import Button from '../common/Button.jsx';

/** Slide-out cart available from every page. */
export default function CartDrawer() {
  const { isOpen, closeCart, items, count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const checkout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-lift"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 bg-surface px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <ShoppingBag className="h-5 w-5 text-brand" /> Your Cart <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{count}</span>
              </h2>
              <button onClick={closeCart} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close cart"><X className="h-5 w-5" /></button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center"><EmptyCart onContinue={closeCart} /></div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto p-4">
                  {items.map((it) => <CartItem key={it.id} item={it} onNavigate={closeCart} />)}
                </ul>
                <footer className="space-y-4 border-t border-ink/10 bg-surface p-5">
                  <CartSummary />
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={closeCart}>Continue Shopping</Button>
                    <Button onClick={checkout}>Checkout</Button>
                  </div>
                  <Button to="/cart" variant="ghost" size="sm" className="w-full" onClick={closeCart}>View full cart</Button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
