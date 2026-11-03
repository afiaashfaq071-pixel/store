import { Link } from 'react-router-dom';
import { promoBanners } from '../../data/banners.js';

/** Three promo tiles. */
export default function PromotionalBanner() {
  return (
    <section className="container-page py-6">
      <div className="grid gap-4 md:grid-cols-3">
        {promoBanners.map((b) => (
          <Link key={b.id} to={b.to} className={`group relative flex min-h-[10rem] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift ${b.style}`}>
            <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-7xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" aria-hidden="true">{b.emoji}</span>
            <h3 className="max-w-[70%] text-xl font-extrabold leading-tight">{b.title}</h3>
            <p className="mt-1 max-w-[70%] text-sm text-white/85">{b.subtitle}</p>
            <span className="mt-4 inline-flex w-fit rounded-full bg-white px-4 py-1.5 text-xs font-bold text-charcoal">{b.cta} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
