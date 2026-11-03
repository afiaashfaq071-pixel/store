import { ShoppingCart } from 'lucide-react';
import StateIllustration from '../common/StateIllustration.jsx';
import Button from '../common/Button.jsx';

/** Empty state shown in the cart drawer, cart page and checkout. */
export default function EmptyCart({ onContinue, title = 'Your cart is empty', text = "Add a few items and they'll show up here." }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <StateIllustration icon={ShoppingCart} />
      <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink/60">{text}</p>
      <Button to="/shop" onClick={onContinue} className="mt-5">Start Shopping</Button>
    </div>
  );
}
