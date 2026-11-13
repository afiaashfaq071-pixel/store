import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, Lock, Menu, Search, ShoppingCart, X } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import ProductSearch from '../products/ProductSearch.jsx';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import useProducts from '../../hooks/useProducts.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop', end: true },
  { to: '/shop?deals=1', label: 'Deals & Offers', match: 'deals' },
  { to: '/shop?best=1', label: 'Best Sellers', match: 'best' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const linkBase = 'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors';

export default function Navbar() {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const { categories } = useProducts();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (l) => {
    useEffect(() => {
      if (!menuOpen) return undefined;
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = previous;
        window.removeEventListener('keydown', onKey);
      };
    }, [menuOpen]);
    if (l.match) return location.pathname === '/shop' && new URLSearchParams(location.search).has(l.match);
    if (l.to === '/shop') return location.pathname === '/shop' && !location.search.includes('deals') && !location.search.includes('best');
    return null;
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-surface/90 shadow-soft backdrop-blur-lg' : 'bg-cream'}`}>
      <div className={`container-page relative flex items-center gap-1.5 transition-all duration-300 max-[359px]:px-3 sm:gap-3 ${scrolled ? 'py-2' : 'py-3 sm:py-4'}`}>
        <button className="shrink-0 rounded-full p-1.5 hover:bg-ink/5 sm:p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>

        <Logo className="shrink-0" responsiveText />

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          <NavLink to="/" end className={({ isActive: a }) => `${linkBase} ${a ? 'bg-brand text-white' : 'hover:bg-ink/5'}`}>Home</NavLink>

          <div onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <button
              className={`${linkBase} inline-flex items-center gap-1 ${megaOpen ? 'bg-ink/5' : 'hover:bg-ink/5'}`}
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onClick={() => setMegaOpen((v) => !v)}
            >
              All Categories <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
            </button>
            {megaOpen && (
              <div className="absolute left-4 top-full w-[min(760px,calc(100%-2rem))] pt-3 sm:left-6 lg:left-8">
                <div className="grid grid-cols-3 gap-1 rounded-3xl border border-ink/5 bg-surface p-4 shadow-lift">
                  {categories.map((c) => (
                    <Link key={c.slug} to={`/category/${c.slug}`} className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-cream">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${c.tint}`}>{c.emoji}</span>
                      <span>
                        <span className="block text-sm font-bold leading-tight">{c.short || c.name}</span>
                        <span className="block text-[11px] text-ink/50">{c.name}</span>
                      </span>
                    </Link>
                  ))}
                  <Link to="/shop" className="col-span-3 mt-2 rounded-2xl bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark">
                    Browse the entire store →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {links.slice(1).map((l) => {
            const manual = isActive(l);
            return (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive: a }) => {
                  const active = manual !== null ? manual : a;
                  return `${linkBase} ${active ? 'bg-brand text-white' : 'hover:bg-ink/5'}`;
                }}
              >
                {l.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop search */}
        <ProductSearch className="mx-4 hidden max-w-md flex-1 xl:block" />

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link to="/admin" className="hidden items-center gap-1.5 rounded-full p-2.5 text-sm font-semibold hover:bg-ink/5 lg:inline-flex" aria-label="Admin login">
            <Lock className="h-5 w-5" aria-hidden="true" />
            <span className="hidden xl:inline">Admin</span>
          </Link>
          <button className="rounded-full p-2 hover:bg-ink/5 sm:p-2.5 xl:hidden" onClick={() => setSearchOpen((v) => !v)} aria-label="Toggle search">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" className="relative rounded-full p-2 hover:bg-ink/5 sm:p-2.5" aria-label={`Wishlist, ${wishCount} items`}>
            <Heart className="h-5 w-5" />
            {wishCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{wishCount}</span>}
          </Link>
          <button onClick={openCart} className="relative flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-2.5 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:gap-2 sm:px-4 sm:py-2.5" aria-label={`Open cart, ${count} items`}>
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-charcoal" data-testid="cart-count">{count}</span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="container-page pb-3 xl:hidden">
          <ProductSearch autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col overflow-y-auto bg-cream p-5 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenuOpen(false)} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close menu"><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className="rounded-xl px-4 py-3 text-base font-semibold hover:bg-surface">{l.label}</Link>
              ))}
            </nav>
            <p className="mb-2 mt-6 px-4 text-xs font-bold uppercase tracking-widest text-ink/40">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="flex items-center gap-2 rounded-xl bg-surface p-3 text-sm font-semibold shadow-sm">
                  <span className="text-xl">{c.emoji}</span>
                  <span className="leading-tight">{c.short || c.name}</span>
                </Link>
              ))}
            </div>
            <Link to="/admin" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
              <Lock className="h-4 w-4" aria-hidden="true" />Admin
            </Link>
          </aside>
        </div>
      )}
    </header>
  );
}