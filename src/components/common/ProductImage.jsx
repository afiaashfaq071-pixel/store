import { useState } from 'react';

/**
 * Product artwork. Products without a photo use emoji-on-gradient art. If a product has an `image`
 * (a gallery photo or URL) it is shown instead; when that image is missing or fails to load the
 * emoji artwork is used, so a card never shows a broken picture.
 * `variant` (0-2) produces alternate tints for the product gallery.
 */
const altTints = ['', 'from-surface-raised to-gold/20', 'from-ink/5 to-brand/20'];
const FALLBACK_TINT = 'from-amber-500/20 to-orange-500/30';

export default function ProductImage({ product, size = 'md', variant = 0, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const emojiSize = { sm: 'text-3xl', md: 'text-6xl', lg: 'text-8xl sm:text-[9rem]' }[size];

  if (product.image && failedSrc !== product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        onError={() => setFailedSrc(product.image)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const gradient = variant === 0 ? product.tint || FALLBACK_TINT : altTints[variant] || product.tint || FALLBACK_TINT;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
      role="img"
      aria-label={product.name}
    >
      <span className={`${emojiSize} select-none drop-shadow-md transition-transform duration-300 group-hover:scale-110 ${variant === 1 ? '-rotate-12' : variant === 2 ? 'rotate-12 scale-90' : ''}`}>
        {product.emoji || '📦'}
      </span>
    </div>
  );
}
