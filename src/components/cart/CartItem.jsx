import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import ProductImage from '../common/ProductImage.jsx';
import QuantityControl from '../common/QuantityControl.jsx';
import useCart from '../../hooks/useCart.js';
import { formatPKR } from '../../utils/format.js';

export default function CartItem({ item, onNavigate }) {
  const { updateQty, removeFromCart } = useCart();
  return (
    <li className="flex gap-3 rounded-2xl bg-surface p-3 shadow-sm">
      <Link to={`/product/${item.id}`} onClick={onNavigate} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <ProductImage product={item} size="sm" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/product/${item.id}`} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand">{item.name}</Link>
            <p className="text-xs text-ink/50">{item.brand} · {formatPKR(item.price)}</p>
            {item.qty >= item.stock && <p className="text-[11px] font-semibold text-gold">Only {item.stock} available</p>}
          </div>
          <button onClick={() => removeFromCart(item.id)} className="rounded-full p-1.5 text-ink/40 hover:bg-red-500/10 hover:text-red-500" aria-label={`Remove ${item.name}`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <QuantityControl size="sm" value={item.qty} max={item.stock} onChange={(q) => updateQty(item.id, q)} />
          <span className="text-sm font-extrabold">{formatPKR(item.price * item.qty)}</span>
        </div>
      </div>
    </li>
  );
}
