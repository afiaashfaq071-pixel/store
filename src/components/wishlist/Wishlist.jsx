import { Heart } from 'lucide-react';
import useWishlist from '../../hooks/useWishlist.js';
import WishlistItem from './WishlistItem.jsx';
import StateIllustration from '../common/StateIllustration.jsx';
import Button from '../common/Button.jsx';

export default function Wishlist() {
  const { items, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <StateIllustration icon={Heart} />
        <h2 className="mt-4 text-2xl font-extrabold">Nothing saved yet</h2>
        <p className="mt-1 max-w-sm text-sm text-ink/60">Tap the heart on any product to save it here for later.</p>
        <Button to="/shop" className="mt-5">Discover Products</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink/60"><Heart className="h-4 w-4 fill-brand text-brand" />{items.length} saved item{items.length > 1 ? 's' : ''}</p>
        <button onClick={clearWishlist} className="text-sm font-semibold text-red-500 hover:underline">Clear all</button>
      </div>
      <ul className="grid gap-4 lg:grid-cols-2">
        {items.map((p) => <WishlistItem key={p.id} product={p} />)}
      </ul>
    </div>
  );
}
