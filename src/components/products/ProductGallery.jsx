import { useState } from 'react';
import ProductImage from '../common/ProductImage.jsx';

/** Main image plus three alternate "angles" (tints) as thumbnails. */
export default function ProductGallery({ product }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className="group aspect-square overflow-hidden rounded-3xl bg-surface shadow-soft">
        <ProductImage product={product} size="lg" variant={active} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square overflow-hidden rounded-2xl border-2 transition ${active === i ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'}`}
            aria-label={`Show image ${i + 1}`}
            aria-pressed={active === i}
          >
            <ProductImage product={product} size="sm" variant={i} />
          </button>
        ))}
      </div>
    </div>
  );
}
