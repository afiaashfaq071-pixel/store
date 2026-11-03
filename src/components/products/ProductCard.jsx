import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import ProductImage from '../common/ProductImage.jsx';
import Rating from '../common/Rating.jsx';
import Badge from '../common/Badge.jsx';
import QuantityControl from '../common/QuantityControl.jsx';
import Modal from '../common/Modal.jsx';
import QuickView from './QuickView.jsx';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import { getDiscountPercent } from '../../data/products.js';
import { formatPKR } from '../../utils/format.js';

/** The one reusable product card used on every listing in the store. */
function ProductCard({ product }) {
  const { addToCart, getQty, updateQty } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickView, setQuickView] = useState(false);

  const qty = getQty(product.id);
  const out = product.stock <= 0;
  const discount = getDiscountPercent(product);
  const wished = isInWishlist(product.id);

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
        <div className="relative aspect-square overflow-hidden">
          <Link to={`/product/${product.id}`} className="block h-full" aria-label={`View ${product.name}`}>
            <ProductImage product={product} />
          </Link>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && <Badge tone="brand">-{discount}%</Badge>}
            {product.bestSeller && <Badge tone="gold">★ Best Seller</Badge>}
            {out && <Badge tone="dark">Out of stock</Badge>}
          </div>

          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-md transition hover:scale-110 ${wished ? 'text-brand' : 'text-ink/50'}`}
            aria-pressed={wished}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-brand' : ''}`} />
          </button>

          <button
            onClick={() => setQuickView(true)}
            className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-1.5 rounded-full bg-charcoal/90 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100 max-lg:py-1.5"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand">{product.brand}</p>
          <Link to={`/product/${product.id}`} className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug hover:text-brand">
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-ink/50">{product.unit}</p>
          <div className="mt-2"><Rating value={product.rating} count={product.reviews} /></div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-extrabold">{formatPKR(product.price)}</span>
            {product.originalPrice && <span className="text-xs text-ink/40 line-through">{formatPKR(product.originalPrice)}</span>}
          </div>

          <div className="mt-auto pt-4">
            {qty > 0 ? (
              <div className="flex items-center justify-between rounded-full bg-brand/10 p-1">
                <QuantityControl size="sm" value={qty} max={product.stock} onChange={(q) => updateQty(product.id, q)} />
                <span className="pr-3 text-xs font-bold text-brand">In cart</span>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                disabled={out}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-2.5 text-sm font-semibold text-white transition hover:bg-brand active:scale-95 disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/50"
              >
                <ShoppingCart className="h-4 w-4" /> {out ? 'Out of stock' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </article>

      <Modal open={quickView} onClose={() => setQuickView(false)} title={product.name} size="max-w-2xl">
        <QuickView product={product} onClose={() => setQuickView(false)} />
      </Modal>
    </>
  );
}

export default memo(ProductCard);
