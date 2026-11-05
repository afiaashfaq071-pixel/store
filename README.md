# ALI HASSAN SUPERMART

> "Everything You Need Under One Roof."

A component-based e-commerce storefront (React + Vite + Tailwind CSS) with a dark theme, working cart / wishlist / checkout, and a demo admin dashboard.

## Run it

```bash
cd ali-hassan-supermart
npm install
npm run dev
```

Then open http://localhost:5173. Production build: `npm run build` (preview with `npm run preview`).

Requires Node 18+.

## Tech

React 18 · Vite 5 · Tailwind CSS 3 · React Router 6 · Lucide React · Framer Motion · Context API · LocalStorage

## What's inside

**Storefront** — `/` home, `/shop` (search, filters, sorting; `?deals=1`, `?best=1`, `?q=`), `/categories`, `/category/:slug` (12 categories), `/product/:id`, `/cart` + slide-out cart drawer, `/checkout`, `/wishlist`, `/about`, `/contact`, branded 404.

**Admin (owner only)** — `/admin` opens only with the owner's secret key (created on first visit, changeable under *Owner contact*). Sections: dashboard, products (add / edit / delete, photo from the phone gallery), categories, stock, orders (status updates), sales, customers, discount coupons, **follow-ups** (happy message 15 days after an order) and **owner contact** (phone + email that receive new-order details, with a Reset button that deletes both). There is no link to the admin on the public store; the owner types `/admin` in the address bar.

**Brand & theme** — dark UI (charcoal page, raised card surfaces, orange and gold accents). Original shopping-bag "A" logo in `src/components/common/Logo.jsx` (plus `public/logo.svg` and `public/favicon.svg`). Colours live in `tailwind.config.js`.

## Project structure

```
src/
├── components/
│   ├── common/      Logo, HeroArt, StateIllustration, Button, Badge, Loader, Toast, Modal,
│   │                SectionHeading, ProductImage, Rating, QuantityControl, ScrollToTop
│   ├── layout/      Navbar (mega-menu), AnnouncementBar, Footer, MobileNavigation, PageLayout
│   ├── home/        Hero, CategorySection, FeaturedProducts, DealsSection, BestSellers,
│   │                PromotionalBanner, WhyChooseUs, Newsletter
│   ├── products/    ProductCard, ProductGrid, ProductDetails, ProductGallery, ProductFilters,
│   │                ProductBrowser, ProductSearch, QuickView, RelatedProducts
│   ├── cart/        CartDrawer, CartItem, CartSummary, EmptyCart
│   ├── categories/  CategoryCard, CategoryPage
│   ├── wishlist/    Wishlist, WishlistItem
│   └── admin/       AdminLayout, StatCard, BarChart, ProductForm
├── context/         Toast, Product (catalogue/categories/coupons), Cart, Wishlist, Order
├── hooks/           useCart, useWishlist, useProducts, useOrders, useDebounce
├── data/            products.js, categories.js, banners.js (announcements, promos, coupons)
├── utils/           format, storage, productFilters, adminStats
├── pages/           storefront pages + pages/admin/*
├── App.jsx          providers + routes only
└── main.jsx
```

## Try these

- Coupons: `WELCOME10` (10% off), `SAVE200` (Rs. 200 off orders over Rs. 2,000), `FREESHIP`.
- Delivery: Rs. 199, free above Rs. 3,000.
- Admin → Products → "Remove sample products" clears the 12 demo items; then add your own (name, price, stock, description, photo, category).
- Admin → Owner contact: save your email, press "Send test email", and open the one-time "Activate" link FormSubmit sends you. After that every new order is emailed to you with all details.
- Admin → Follow-ups: customers whose order is 15+ days old, with ready-written WhatsApp / SMS messages.

## Database setup (Supabase) — optional but needed for real customers

Without these steps the site runs in **demo mode** (everything is saved only in the browser you use; demonstration only, not production security). With them, products, categories, coupons, orders, newsletter sign-ups and the owner contact live in a Supabase database, so every customer's phone sees the same shop and the owner sees all orders from any device.

1. Create a free project at supabase.com.
2. **SQL Editor → New query:** open `supabase/schema.sql`, change `CHANGE-ME@example.com` to the owner's email, paste the whole file, press **Run**. (Safe to run again on an existing project; it upgrades older versions.)
3. **Authentication → Users → Add user:** create the owner login with that same email and a password (tick "Auto confirm"). Then **Authentication → Sign In / Providers → turn OFF "Allow new users to sign up"**.
4. **Project Settings → API:** copy the *Project URL* and the *anon public* key. Never put the `service_role` key in this project.
5. Copy `.env.example` to `.env`, paste the two values, restart `npm run dev` (or set the same two variables on your host before building).

### Which features need Supabase

| Feature | Demo mode (no database) | With Supabase |
|---|---|---|
| Browse, search, filter, cart, checkout (Cash on Delivery) | Works | Works |
| Products, categories, coupons added by admin | Saved in this browser only | Shared database, same for all visitors |
| Orders, stock reduction, cancellation | This browser only | Server prices the order, checks stock and coupon, reduces stock atomically, restores it exactly once on cancel |
| Coupon expiry and usage limits | Checked in the browser | Enforced by the server on every order |
| Admin login | Browser-side key (not real security) | Real email + password (Supabase Auth) and Row Level Security |
| Newsletter | Honest message: nothing is saved | Saved once per email (duplicates recognised) |
| Contact form | Needs the store email in Admin → Owner contact (FormSubmit) | Same |
| Owner contact for all customers | This browser only | Shared |

## Run it locally

`npm install`, then `npm run dev`. `npm test` runs the logic tests; `npm run build` makes the production build.

Notes: the owner phone / email are readable by the store (that is how orders reach you), so use a business contact. Product photos are stored inside the database rows (keep them small; the form shrinks them). Contact form and order emails use the free FormSubmit service: the first message triggers an activation email you must confirm.

## Important: what this version does and does not do

- **Demo mode** is for demonstration only. A customer on another phone would not see products added in the owner's browser, and the admin key is only checked in the browser.
- **Notifications.** New-order emails go through FormSubmit. WhatsApp / SMS messages open ready-written and the person taps send; fully automatic messages need a server and a paid messaging service.
- **Cash on Delivery only** — there is no payment processing.
- Without a database, product photos are stored in the browser (about 5 MB limit in total).

## Swapping in real data later

Replace the LocalStorage reads/writes in `ProductContext.jsx`, `OrderContext.jsx` and `SettingsContext.jsx` with API calls; the rest of the UI reads from those contexts only.
