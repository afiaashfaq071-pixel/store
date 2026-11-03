import { NavLink } from 'react-router-dom';
import { Grid2x2, Heart, Home, ShoppingBag, ShoppingCart } from 'lucide-react';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';

/** Fixed bottom tab bar, visible on small screens only. */
export default function MobileNavigation() {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();

  const tab = ({ isActive }) =>
    `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-ink/60'}`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden" aria-label="Quick navigation">
      <div className="mx-auto flex max-w-md items-stretch">
        <NavLink to="/" end className={tab}><Home className="h-5 w-5" />Home</NavLink>
        <NavLink to="/shop" end className={tab}><ShoppingBag className="h-5 w-5" />Shop</NavLink>
        <NavLink to="/categories" className={tab}><Grid2x2 className="h-5 w-5" />Categories</NavLink>
        <NavLink to="/wishlist" className={tab}>
          <span className="relative">
            <Heart className="h-5 w-5" />
            {wishCount > 0 && <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{wishCount}</span>}
          </span>
          Wishlist
        </NavLink>
        <button onClick={openCart} className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-ink/60" aria-label={`Open cart, ${count} items`}>
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{count}</span>}
          </span>
          Cart
        </button>
      </div>
    </nav>
  );
}
