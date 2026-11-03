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

**Admin (demo)** — `/admin`: dashboard, products (add / edit / delete), categories, stock, orders (status updates), sales overview, customers, discount coupons.

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
- Cart, wishlist, orders and admin edits persist in your browser's LocalStorage. "Reset demo data" is in Admin → Categories.

## Important: this is a demo

- **No backend.** Orders, contact messages and newsletter sign-ups are not sent anywhere. Checkout stores the order in this browser only (visible in the admin) and the confirmation screen says so.
- **Cash on Delivery only** — there is no payment processing.
- **Admin has no login.** Anyone who opens `/admin` can use it. Add real authentication before any public deployment.
- **Sample data.** Products, prices and brand names are illustrative; the contact details in the footer are placeholders. Product pictures are emoji-on-gradient art so the project needs no image files; set an `image` URL on a product (or in the admin form) to use real photos.

## Swapping in real data later

Replace `src/data/products.js` with an API call inside `ProductContext.jsx`; the rest of the UI reads from that context only.
