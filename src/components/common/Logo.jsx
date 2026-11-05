import { Link } from 'react-router-dom';

/**
 * ALI HASSAN SUPERMART brand mark:
 * an orange rounded tile holding a dark shopping bag with a golden "A" monogram.
 */
export function LogoIcon({ className = 'h-11 w-11' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Ali Hassan Supermart logo">
      <rect width="64" height="64" rx="16" fill="#FF8A35" />
      <path d="M19 27 H45 L43 52 H21 Z" fill="#171923" />
      <path d="M25 27 V23 a7 7 0 0 1 14 0 V27" fill="none" stroke="#171923" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M26 45 L32 32 L38 45 M28.3 40.5 H35.7" fill="none" stroke="#FFD166" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Reusable logo.
 * variant: "horizontal" (icon + wordmark) | "icon" (compact mark only) | "stacked"
 * The UI is dark, so the wordmark is light by default.
 */
export default function Logo({ variant = 'horizontal', to = '/', className = '', showTagline = false, responsiveText = false }) {
  const content =
    variant === 'icon' ? (
      <LogoIcon className="h-10 w-10" />
    ) : variant === 'stacked' ? (
      <div className="flex flex-col items-center gap-2 text-center">
        <LogoIcon className="h-16 w-16" />
        <div>
          <p className="font-display text-xl font-extrabold leading-none text-ink">ALI HASSAN</p>
          <p className="mt-1 font-display text-xs font-semibold tracking-[0.35em] text-brand">SUPERMART</p>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <LogoIcon className="h-11 w-11 shrink-0" />
        <div className={`leading-none ${responsiveText ? 'hidden min-[400px]:block' : ''}`}>
          <p className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">ALI HASSAN</p>
          <p className="mt-1 font-display text-[10px] font-semibold tracking-[0.38em] text-brand sm:text-[11px]">SUPERMART</p>
          {showTagline && <p className="mt-1 text-[10px] text-ink/60">Everything You Need Under One Roof.</p>}
        </div>
      </div>
    );

  return (
    <Link to={to} className={`inline-flex items-center ${className}`} aria-label="ALI HASSAN SUPERMART — home">
      {content}
    </Link>
  );
}
