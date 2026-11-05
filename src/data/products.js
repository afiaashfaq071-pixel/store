// Small sample catalogue (demo data, prices in PKR): one product per category so every
// category page has something to show. The owner can remove all samples with one button in
// Admin → Products and then add real items.
// Row shape: [name, brand, price, originalPrice|0, rating, reviews, stock, emoji, unit, popularity]
const rows = {
  grocery: [
    ['Premium Tea Leaves 950g', 'Tapal Danedar', 1180, 1290, 4.8, 540, 80, '🍵', '950 g', 99],
  ],
  'biscuits-snacks': [
    ['Chocolate Cream Biscuits Family Pack', 'Peek Freans', 190, 220, 4.6, 410, 200, '🍪', 'Family pack', 97],
  ],
  'cosmetics-beauty': [
    ['Face Wash Neem & Aloe 150ml', 'Himalaya', 395, 0, 4.5, 330, 130, '🧴', '150 ml', 90],
  ],
  'shampoos-personal-care': [
    ['Anti-Dandruff Shampoo 400ml', 'Head & Shoulders', 780, 880, 4.6, 520, 110, '🧴', '400 ml', 96],
  ],
  'sports-fitness': [
    ['Kashmir Willow Cricket Bat', 'SS Sports', 4800, 5500, 4.6, 75, 18, '🏏', '1 piece', 70],
  ],
  stationery: [
    ['Long Notebook 200 Pages (Pack of 6)', 'Paper Line', 780, 880, 4.6, 230, 100, '📓', '6 pcs', 93],
  ],
  'kitchen-utensils': [
    ['Electric Kettle 1.8L', 'Anex', 3250, 3600, 4.5, 140, 33, '☕', '1.8 litre', 78],
  ],
  'ice-cream-frozen': [
    ['Vanilla Ice Cream Family Tub 1L', 'Omore', 850, 920, 4.7, 260, 50, '🍨', '1 litre', 94],
  ],
  'household-cleaning': [
    ['Washing Powder 2kg', 'Surf Excel', 1190, 1320, 4.6, 410, 90, '🧺', '2 kg', 95],
  ],
  beverages: [
    ['Instant Coffee Jar 100g', 'Nescafe', 890, 980, 4.8, 310, 80, '☕', '100 g', 91],
  ],
  bakery: [
    ['Fresh Sandwich Bread Large', 'Dawn', 160, 0, 4.6, 360, 100, '🍞', '1 loaf', 96],
  ],
  'home-accessories': [
    ['Cotton Bed Sheet Double', 'Bonanza Home', 2490, 2900, 4.6, 130, 28, '🛏️', '1 set', 74],
  ],
};

const descriptions = [
  'Carefully selected and quality-checked, this item is a dependable choice for every household.',
  'A customer favourite at ALI HASSAN SUPERMART — great value, consistent quality and freshly stocked.',
  'Sourced from trusted brands and stored properly so you always receive it in perfect condition.',
];

const tints = [
  'from-amber-500/20 to-orange-500/30',
  'from-rose-500/20 to-pink-500/30',
  'from-sky-500/20 to-blue-500/30',
  'from-emerald-500/20 to-green-500/30',
  'from-violet-500/20 to-purple-500/30',
  'from-yellow-500/20 to-amber-500/30',
];

let id = 1;
export const products = Object.entries(rows).flatMap(([category, list]) =>
  list.map(([name, brand, price, originalPrice, rating, reviews, stock, emoji, unit, popularity], i) => {
    const product = {
      id: id,
      name,
      brand,
      category,
      price,
      originalPrice: originalPrice || null,
      rating,
      reviews,
      stock,
      emoji,
      unit,
      popularity,
      sample: true, // marks demo items so the owner can remove them all at once
      tint: tints[(id + i) % tints.length],
      description: `${name} by ${brand}. ${descriptions[id % descriptions.length]}`,
      createdAt: Date.UTC(2026, 9, 1) + id * 86400000, // higher id = newer
      featured: popularity >= 85,
      bestSeller: popularity >= 90,
    };
    id += 1;
    return product;
  })
);

export const getProductById = (pid) => products.find((p) => p.id === Number(pid));
export const getDiscountPercent = (p) =>
  p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
