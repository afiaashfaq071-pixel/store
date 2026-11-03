// Category definitions. `slug` is used in URLs (/category/:slug).
export const categories = [
  { slug: 'grocery', name: 'Grocery & Daily Essentials', short: 'Grocery', emoji: '🛒', tint: 'from-amber-500/20 to-orange-500/30', blurb: 'Rice, flour, oil, tea, spices and everyday kitchen staples.' },
  { slug: 'biscuits-snacks', name: 'Biscuits & Snacks', short: 'Snacks', emoji: '🍪', tint: 'from-yellow-500/20 to-amber-500/30', blurb: 'Crunchy biscuits, chips, nuts and sweet treats.' },
  { slug: 'cosmetics-beauty', name: 'Cosmetics & Beauty', short: 'Beauty', emoji: '💄', tint: 'from-pink-500/20 to-rose-500/30', blurb: 'Makeup, skincare and beauty essentials.' },
  { slug: 'shampoos-personal-care', name: 'Shampoos & Personal Care', short: 'Personal Care', emoji: '🧴', tint: 'from-sky-500/20 to-cyan-500/30', blurb: 'Shampoos, soaps, toothpaste and daily grooming.' },
  { slug: 'sports-fitness', name: 'Sports & Fitness', short: 'Sports', emoji: '🏏', tint: 'from-green-500/20 to-emerald-500/30', blurb: 'Cricket, football, gym gear and fitness accessories.' },
  { slug: 'stationery', name: 'Stationery & School Supplies', short: 'Stationery', emoji: '✏️', tint: 'from-indigo-500/20 to-blue-500/30', blurb: 'Notebooks, pens, geometry boxes and school bags.' },
  { slug: 'kitchen-utensils', name: 'Kitchen & Utensils', short: 'Kitchen', emoji: '🍳', tint: 'from-stone-500/20 to-orange-500/30', blurb: 'Cookware, cutlery, containers and kitchen tools.' },
  { slug: 'ice-cream-frozen', name: 'Ice Creams & Frozen Foods', short: 'Frozen', emoji: '🍦', tint: 'from-cyan-500/20 to-sky-500/30', blurb: 'Ice creams, nuggets, kebabs and frozen favourites.' },
  { slug: 'household-cleaning', name: 'Household & Cleaning Products', short: 'Cleaning', emoji: '🧼', tint: 'from-teal-500/20 to-emerald-500/30', blurb: 'Detergents, floor cleaners, tissues and disinfectants.' },
  { slug: 'beverages', name: 'Beverages & Drinks', short: 'Beverages', emoji: '🥤', tint: 'from-red-500/20 to-orange-500/30', blurb: 'Juices, soft drinks, tea, coffee and water.' },
  { slug: 'bakery', name: 'Bakery Products', short: 'Bakery', emoji: '🥖', tint: 'from-amber-500/20 to-yellow-500/30', blurb: 'Fresh bread, rusks, cakes and baking needs.' },
  { slug: 'home-accessories', name: 'Home Accessories', short: 'Home', emoji: '🏠', tint: 'from-violet-500/20 to-purple-500/30', blurb: 'Decor, storage, bedding and handy home items.' },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug);
