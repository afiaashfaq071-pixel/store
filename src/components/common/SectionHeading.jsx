import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ eyebrow, title, subtitle, linkTo, linkLabel = 'View all', align = 'left' }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${align === 'center' ? 'flex-col items-center text-center' : ''}`}>
      <div>
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-0.5 w-5 rounded-full bg-brand" aria-hidden="true" /> {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-ink/60 sm:text-base">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
