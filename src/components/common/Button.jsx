import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-md shadow-brand/30',
  dark: 'bg-ink/10 text-ink hover:bg-ink/20',
  outline: 'border-2 border-ink/15 bg-surface text-ink hover:border-brand hover:text-brand',
  ghost: 'text-ink hover:bg-ink/5',
  gold: 'bg-gold text-charcoal hover:bg-gold-dark',
  success: 'bg-success text-white hover:bg-success-dark',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/** Renders a <Link> when `to` is given, otherwise a <button>. */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  className = '',
  icon: Icon,
  type = 'button',
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;
  const inner = (
    <>
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
