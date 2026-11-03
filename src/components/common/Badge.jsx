const tones = {
  brand: 'bg-brand text-white',
  gold: 'bg-gold text-charcoal',
  success: 'bg-success/15 text-success-dark',
  dark: 'bg-charcoal text-white ring-1 ring-white/15',
  danger: 'bg-red-500/15 text-red-400',
  neutral: 'bg-ink/10 text-ink/70',
  info: 'bg-sky-500/15 text-sky-300',
};

export default function Badge({ children, tone = 'brand', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
