import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, ShoppingCart, Truck, Zap } from 'lucide-react';
import ProductGallery from './ProductGallery.jsx';
import Rating from '../common/Rating.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import QuantityControl from '../common/QuantityControl.jsx';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import useProducts from '../../hooks/useProducts.js';
import { getDiscountPercent } from '../../data/products.js';
import { reviewSamples } from '../../data/banners.js';
import { formatPKR } from '../../utils/format.js';

export default function ProductDetails({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { categories } = useProducts();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');

  const category = categories.find((c) => c.slug === product.category);
  const out = product.stock <= 0;
  const discount = getDiscountPercent(product);
  const wished = isInWishlist(product.id);

  const buyNow = () => {
    if (addToCart(product, qty)) navigate('/checkout');
  };

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery product={product} />

        <div>
          {category && <Link to={`/category/${category.slug}`} className="text-xs font-bold uppercase tracking-wider text-brand hover:underline">{category.name}</Link>}
          <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-ink/60">Brand: <span className="font-semibold text-ink">{product.brand}</span> · Pack: {product.unit}</p>
          <div className="mt-3"><Rating value={product.rating} count={product.reviews} size="lg" /></div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold">{formatPKR(product.price)}</span>
            {product.originalPrice && <span className="text-lg text-ink/40 line-through">{formatPKR(product.originalPrice)}</span>}
            {discount > 0 && <Badge>Save {discount}%</Badge>}
          </div>

          <div className="mt-4">
            {out ? <Badge tone="danger">Out of stock</Badge> : product.stock <= 10 ? <Badge tone="gold">Only {product.stock} left!</Badge> : <Badge tone="success">In stock</Badge>}
          </div>

          <p className="mt-5 leading-relaxed text-ink/70">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityControl value={qty} min={1} max={Math.max(1, product.stock)} onChange={setQty} />
            <Button icon={ShoppingCart} size="lg" onClick={() => addToCart(product, qty)} disabled={out} className="flex-1 sm:flex-none">Add to Cart</Button>
            <Button icon={Zap} size="lg" variant="dark" onClick={buyNow} disabled={out} className="flex-1 sm:flex-none">Buy Now</Button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${wished ? 'border-brand bg-brand/10 text-brand' : 'border-ink/10 text-ink/50 hover:border-brand hover:text-brand'}`}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-5 w-5 ${wished ? 'fill-brand' : ''}`} />
            </button>
          </div>

          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            <li className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm"><Truck className="h-5 w-5 text-brand" />Free delivery over Rs. 3,000</li>
            <li className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm"><ShieldCheck className="h-5 w-5 text-success" />Quality checked · Cash on Delivery</li>
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex gap-2 border-b border-ink/10" role="tablist">
          {[['description', 'Description'], ['reviews', `Customer Reviews (${reviewSamples.length})`]].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-bold transition ${tab === key ? 'border-brand text-brand' : 'border-transparent text-ink/50 hover:text-ink'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel">
          {tab === 'description' ? (
            <div className="max-w-3xl space-y-3 leading-relaxed text-ink/70">
              <p>{product.description}</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Brand: {product.brand}</li>
                <li>Pack size: {product.unit}</li>
                <li>Category: {category?.name}</li>
                {product.sample && <li>Sample product — images are illustrative.</li>}
              </ul>
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {reviewSamples.map((r) => (
                <li key={r.name} className="rounded-2xl bg-surface p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{r.name}</p>
                    <Rating value={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
