/**
 * Product artwork. The demo catalogue uses emoji-on-gradient illustrations so the project
 * runs offline with zero image files. If a product has an `image` URL it is used instead
 * (lazy-loaded), which makes it easy to swap in real photography later.
 * `variant` (0-2) produces alternate tints for the product gallery.
 */
const altTints = ['', 'from-surface-raised to-gold/20', 'from-ink/5 to-brand/20'];

export default function ProductImage({ product, size = 'md', variant = 0, className = '' }) {
  const emojiSize = { sm: 'text-3xl', md: 'text-6xl', lg: 'text-8xl sm:text-[9rem]' }[size];
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  }
  const gradient = variant === 0 ? product.tint : altTints[variant] || product.tint;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
      role="img"
      aria-label={product.name}
    >
      <span className={`${emojiSize} select-none drop-shadow-md transition-transform duration-300 group-hover:scale-110 ${variant === 1 ? '-rotate-12' : variant === 2 ? 'rotate-12 scale-90' : ''}`}>
        {product.emoji}
      </span>
    </div>
  );
}
