import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import useProducts from '../../hooks/useProducts.js';

export default function Footer() {
  const { categories } = useProducts();
  return (
    <footer className="mt-20 border-t border-white/10 bg-charcoal text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo showTagline />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Your friendly neighbourhood supermart — groceries, beauty, sports, stationery and everything in between, delivered to your door.
          </p>
          
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Shop</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {categories.slice(0, 7).map((c) => (
              <li key={c.slug}><Link to={`/category/${c.slug}`} className="hover:text-brand">{c.name}</Link></li>
            ))}
            <li><Link to="/categories" className="font-semibold text-brand hover:underline">All categories →</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Company</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-brand">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
            <li><Link to="/shop?deals=1" className="hover:text-brand">Deals & Offers</Link></li>
            <li><Link to="/shop?best=1" className="hover:text-brand">Best Sellers</Link></li>
            <li><Link to="/wishlist" className="hover:text-brand">My Wishlist</Link></li>
            <li><Link to="/admin" className="hover:text-brand">Admin Dashboard (demo)</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Visit & Contact</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Main Boulevard, Lahore, Pakistan</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />+92 300 0000000</li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />hello@alihassansupermart.pk</li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Daily 9:00 AM – 11:00 PM</li>
          </ul>
          <p className="mt-5 inline-block rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">💵 Cash on Delivery available</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        <p>© {new Date().getFullYear()} ALI HASSAN SUPERMART — Everything You Need Under One Roof. Demo storefront: sample products, no real orders are processed.</p>
      </div>
    </footer>
  );
}
