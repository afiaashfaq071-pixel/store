import { Star } from 'lucide-react';

export default function Rating({ value, count, size = 'sm' }) {
  const dim = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`${dim} ${n <= Math.round(value) ? 'fill-gold text-gold' : 'fill-ink/10 text-ink/10'}`} />
        ))}
      </div>
      <span className="text-xs font-semibold text-ink/70">{Number(value).toFixed(1)}</span>
      {count != null && <span className="text-xs text-ink/40">({count})</span>}
    </div>
  );
}
