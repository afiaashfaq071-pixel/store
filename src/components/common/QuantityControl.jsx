import { Minus, Plus } from 'lucide-react';

/** Plus / minus quantity selector used on product cards, product page and cart. */
export default function QuantityControl({ value, onChange, min = 0, max = 99, size = 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div className="inline-flex items-center rounded-full border border-ink/10 bg-surface">
      <button
        type="button"
        className={`${box} flex items-center justify-center rounded-full text-ink transition hover:bg-brand/10 hover:text-brand disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">{value}</span>
      <button
        type="button"
        className={`${box} flex items-center justify-center rounded-full text-ink transition hover:bg-brand/10 hover:text-brand disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
