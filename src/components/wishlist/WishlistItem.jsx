import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import ProductImage from '../common/ProductImage.jsx';
import Rating from '../common/Rating.jsx';
import Button from '../common/Button.jsx';
import useWishlist from '../../hooks/useWishlist.js';
import { formatPKR } from '../../utils/format.js';

export default function WishlistItem({ product }) {
  const { removeFromWishlist, moveToCart } = useWishlist();
  const out = product.stock <= 0;
  return (
    <li className="flex gap-4 rounded-2xl bg-surface p-3 shadow-soft sm:p-4">
      <Link to={`/product/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
        <ProductImage product={product} size="sm" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">{product.brand}</p>
          <Link to={`/product/${product.id}`} className="line-clamp-2 font-bold leading-snug hover:text-brand">{product.name}</Link>
          <div className="mt-1"><Rating value={product.rating} count={product.reviews} /></div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold">{formatPKR(product.price)}</span>
          <div className="flex gap-2">
            <Button size="sm" icon={ShoppingCart} onClick={() => moveToCart(product)} disabled={out}>{out ? 'Out of stock' : 'Move to cart'}</Button>
            <button onClick={() => removeFromWishlist(product.id)} className="rounded-full border border-ink/10 p-2 text-ink/50 hover:border-red-200 hover:bg-red-500/10 hover:text-red-500" aria-label={`Remove ${product.name} from wishlist`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
