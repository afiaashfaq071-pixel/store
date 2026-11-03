import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ProductImage from '../common/ProductImage.jsx';
import Rating from '../common/Rating.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import QuantityControl from '../common/QuantityControl.jsx';
import useCart from '../../hooks/useCart.js';
import { getDiscountPercent } from '../../data/products.js';
import { formatPKR } from '../../utils/format.js';

/** Compact product preview shown inside the Quick View modal. */
export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;
  const discount = getDiscountPercent(product);

  const add = () => {
    if (addToCart(product, qty)) onClose?.();
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-2xl"><ProductImage product={product} size="lg" /></div>
      <div className="flex flex-col">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">{product.brand}</p>
        <Rating value={product.rating} count={product.reviews} />
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold">{formatPKR(product.price)}</span>
          {product.originalPrice && <span className="text-sm text-ink/40 line-through">{formatPKR(product.originalPrice)}</span>}
          {discount > 0 && <Badge>-{discount}%</Badge>}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{product.description}</p>
        <p className="mt-3 text-sm">
          {out ? <Badge tone="danger">Out of stock</Badge> : <Badge tone="success">In stock ({product.stock} available)</Badge>}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <QuantityControl value={qty} min={1} max={Math.max(1, product.stock)} onChange={setQty} />
          <Button icon={ShoppingCart} onClick={add} disabled={out} className="flex-1">Add to Cart</Button>
        </div>
        <Link to={`/product/${product.id}`} onClick={onClose} className="mt-4 text-center text-sm font-semibold text-brand hover:underline">View full details →</Link>
      </div>
    </div>
  );
}
