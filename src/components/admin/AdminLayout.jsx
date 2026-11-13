import { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { BarChart3, Boxes, HeartHandshake, LayoutDashboard, Layers, Lock, Menu, Package, Percent, Phone, ShoppingBag, Store, Users, X } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import { AdminLockContext } from './AdminGate.jsx';
import useProducts from '../../hooks/useProducts.js';
import useOrders from '../../hooks/useOrders.js';
import { isSupabaseEnabled } from '../../lib/supabase.js';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/stock', label: 'Stock', icon: Boxes },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/sales', label: 'Sales', icon: BarChart3 },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/discounts', label: 'Discounts', icon: Percent },
  { to: '/admin/follow-ups', label: 'Follow-ups', icon: HeartHandshake },
  { to: '/admin/settings', label: 'Owner contact', icon: Phone },
];

/** Separate admin shell (no storefront navbar). Opened only through AdminGate (owner key). */
export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { lock } = useContext(AdminLockContext);
  const { refreshProducts } = useProducts();
  const { refreshOrders } = useOrders();

  // With the database on, pull the latest products and orders whenever the admin opens.
  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, [refreshProducts, refreshOrders]);

  // While the side menu is open: stop the page behind it from scrolling and let Escape close it.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col bg-charcoal p-5 text-white">
      <div className="mb-8 flex items-center justify-between">
        <Logo to="/admin" />
        <button className="rounded-full p-1.5 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Admin">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon className="h-5 w-5" />{label}
          </NavLink>
        ))}
      </nav>
      <Link to="/" className="mt-6 flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/10"><Store className="h-4 w-4" />Back to store</Link>
      <button onClick={lock} className="mt-2 flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/10"><Lock className="h-4 w-4" />Lock admin</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">{sidebar}</div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink/10 bg-surface/90 px-4 py-3 backdrop-blur lg:px-8">
          <button className="rounded-full p-2 hover:bg-ink/5 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button>
          <h1 className="text-lg font-extrabold">Admin Dashboard</h1>
          <span className="ml-auto rounded-full bg-gold/30 px-3 py-1 text-[11px] font-bold">{isSupabaseEnabled ? 'Owner area' : 'DEMO · data saved in this browser only'}</span>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}