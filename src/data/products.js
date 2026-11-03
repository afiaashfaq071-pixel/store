// Sample catalogue (demo data, prices in PKR).
// Row shape: [name, brand, price, originalPrice|0, rating, reviews, stock, emoji, unit, popularity]
const rows = {
  grocery: [
    ['Basmati Rice Super Kernel 5kg', 'Guard', 1850, 2100, 4.7, 328, 60, '🍚', '5 kg', 95],
    ['Sunflower Cooking Oil 1L', 'Dalda', 640, 700, 4.5, 211, 120, '🛢️', '1 litre', 90],
    ['Premium Tea Leaves 950g', 'Tapal Danedar', 1180, 1290, 4.8, 540, 80, '🍵', '950 g', 99],
    ['Whole Wheat Flour 10kg', 'Sunridge', 1450, 0, 4.4, 160, 45, '🌾', '10 kg', 80],
    ['Red Chilli Powder 200g', 'National', 285, 310, 4.6, 190, 150, '🌶️', '200 g', 75],
    ['White Sugar 1kg', 'Local Mill', 175, 0, 4.2, 95, 0, '🧂', '1 kg', 60],
  ],
  'biscuits-snacks': [
    ['Chocolate Cream Biscuits Family Pack', 'Peek Freans', 190, 220, 4.6, 410, 200, '🍪', 'Family pack', 97],
    ['Salted Potato Chips 130g', 'Lays', 150, 0, 4.5, 305, 180, '🥔', '130 g', 92],
    ['Mixed Dry Fruit Nuts 500g', 'Nimco Garden', 1350, 1500, 4.7, 120, 40, '🥜', '500 g', 70],
    ['Wafer Rolls Vanilla 12 Pack', 'Tiffany', 360, 400, 4.3, 140, 90, '🍥', '12 pcs', 72],
    ['Masala Namkeen Mix 300g', 'Bhujia House', 260, 0, 4.4, 88, 110, '🥨', '300 g', 65],
    ['Dark Chocolate Bar 100g', 'Cadbury', 330, 360, 4.8, 260, 75, '🍫', '100 g', 88],
  ],
  'cosmetics-beauty': [
    ['Matte Lipstick Rosewood', 'Medora', 450, 520, 4.4, 210, 70, '💄', '1 piece', 82],
    ['Waterproof Mascara Black', 'Maybelline', 1250, 1450, 4.6, 180, 35, '👁️', '10 ml', 78],
    ['Face Wash Neem & Aloe 150ml', 'Himalaya', 395, 0, 4.5, 330, 130, '🧴', '150 ml', 90],
    ['Whitening Day Cream 50g', 'Fair & Lovely', 320, 360, 4.1, 250, 100, '🧖', '50 g', 74],
    ['Compact Powder Beige', 'Rivaj UK', 520, 0, 4.2, 95, 55, '🪞', '12 g', 60],
    ['Rose Water Spray 200ml', 'Hashmi', 280, 310, 4.7, 140, 85, '🌹', '200 ml', 68],
  ],
  'shampoos-personal-care': [
    ['Anti-Dandruff Shampoo 400ml', 'Head & Shoulders', 780, 880, 4.6, 520, 110, '🧴', '400 ml', 96],
    ['Silky Smooth Shampoo 360ml', 'Sunsilk', 560, 620, 4.4, 410, 140, '💆', '360 ml', 88],
    ['Beauty Soap Pack of 3', 'Lux', 285, 0, 4.5, 280, 220, '🧼', '3 x 100 g', 85],
    ['Whitening Toothpaste 150g', 'Colgate', 310, 340, 4.7, 450, 190, '🪥', '150 g', 91],
    ['Deodorant Body Spray 150ml', 'Axe', 495, 560, 4.5, 190, 90, '🌬️', '150 ml', 76],
    ['Hand Wash Antibacterial 500ml', 'Dettol', 420, 0, 4.8, 340, 160, '🧽', '500 ml', 89],
  ],
  'sports-fitness': [
    ['Kashmir Willow Cricket Bat', 'SS Sports', 4800, 5500, 4.6, 75, 18, '🏏', '1 piece', 70],
    ['Size 5 Training Football', 'Nivia', 1650, 1900, 4.5, 90, 40, '⚽', '1 piece', 77],
    ['Yoga Mat 6mm Non-Slip', 'FitLife', 1450, 0, 4.4, 110, 35, '🧘', '1 piece', 66],
    ['Adjustable Dumbbell Pair 10kg', 'IronCore', 3900, 4400, 4.7, 60, 15, '🏋️', '2 pcs', 62],
    ['Badminton Racket Set of 2', 'Yonex Lite', 2100, 2400, 4.3, 82, 28, '🏸', '2 pcs', 64],
    ['Skipping Rope Speed', 'FitLife', 450, 0, 4.2, 70, 0, '🪢', '1 piece', 52],
  ],
  stationery: [
    ['Long Notebook 200 Pages (Pack of 6)', 'Paper Line', 780, 880, 4.6, 230, 100, '📓', '6 pcs', 93],
    ['Gel Pens Blue 10 Pack', 'Dollar', 350, 390, 4.5, 190, 150, '🖊️', '10 pcs', 84],
    ['Geometry Box Complete Set', 'Faber-Castell', 420, 0, 4.7, 150, 85, '📐', '1 set', 81],
    ['School Backpack 18 inch', 'Kids Zone', 2350, 2800, 4.4, 95, 30, '🎒', '1 piece', 79],
    ['Color Pencils 24 Shades', 'Staedtler', 690, 760, 4.8, 170, 70, '🖍️', '24 pcs', 86],
    ['A4 Photocopy Paper Ream', 'Double A', 1350, 0, 4.6, 120, 55, '📄', '500 sheets', 73],
  ],
  'kitchen-utensils': [
    ['Non-Stick Frying Pan 28cm', 'Prestige', 2250, 2650, 4.5, 130, 40, '🍳', '1 piece', 83],
    ['Stainless Steel Cutlery Set 24pc', 'Elegance', 2990, 3400, 4.6, 88, 25, '🍴', '24 pcs', 71],
    ['Glass Food Containers Set of 5', 'Pyrex Style', 1890, 0, 4.4, 76, 36, '🥡', '5 pcs', 67],
    ['Pressure Cooker 7 Litre', 'Hawkins', 4500, 5100, 4.7, 105, 14, '🍲', '7 litre', 75],
    ['Chopping Board Bamboo', 'HomeCraft', 690, 780, 4.3, 64, 60, '🪵', '1 piece', 55],
    ['Electric Kettle 1.8L', 'Anex', 3250, 3600, 4.5, 140, 33, '☕', '1.8 litre', 78],
  ],
  'ice-cream-frozen': [
    ['Vanilla Ice Cream Family Tub 1L', 'Omore', 850, 920, 4.7, 260, 50, '🍨', '1 litre', 94],
    ['Chocolate Cone Ice Cream', 'Walls', 120, 0, 4.5, 330, 200, '🍦', '1 cone', 90],
    ['Chicken Nuggets 500g', 'K&Ns', 790, 860, 4.6, 190, 70, '🍗', '500 g', 87],
    ['Seekh Kebab Frozen 12 pcs', 'Menu', 690, 0, 4.4, 150, 65, '🍢', '12 pcs', 72],
    ['Mango Kulfi Sticks Pack of 4', 'Omore', 320, 360, 4.6, 120, 95, '🥭', '4 pcs', 80],
    ['French Fries Crinkle 1kg', 'McCain', 720, 790, 4.5, 175, 60, '🍟', '1 kg', 82],
  ],
  'household-cleaning': [
    ['Washing Powder 2kg', 'Surf Excel', 1190, 1320, 4.6, 410, 90, '🧺', '2 kg', 95],
    ['Dishwash Liquid Lemon 750ml', 'Vim', 340, 0, 4.5, 280, 140, '🍋', '750 ml', 88],
    ['Floor Cleaner Pine 1L', 'Harpic', 380, 420, 4.4, 170, 100, '🧹', '1 litre', 74],
    ['Facial Tissue Box 200 pulls', 'Rose Petal', 220, 0, 4.7, 360, 210, '🧻', '200 pulls', 85],
    ['Toilet Cleaner 750ml', 'Harpic', 360, 400, 4.6, 230, 130, '🚽', '750 ml', 78],
    ['Garbage Bags Large 30 pcs', 'CleanPro', 290, 0, 4.2, 98, 150, '🗑️', '30 pcs', 58],
  ],
  beverages: [
    ['Cola Soft Drink 2.25L', 'Pepsi', 235, 0, 4.5, 310, 250, '🥤', '2.25 litre', 92],
    ['Mango Juice 1L', 'Nestle Fruita Vitals', 295, 330, 4.6, 240, 120, '🧃', '1 litre', 89],
    ['Mineral Water 1.5L Pack of 6', 'Nestle Pure Life', 420, 460, 4.7, 200, 150, '💧', '6 x 1.5 L', 86],
    ['Instant Coffee Jar 100g', 'Nescafe', 890, 980, 4.8, 310, 80, '☕', '100 g', 91],
    ['Green Tea Bags 100 Count', 'Lipton', 650, 720, 4.5, 175, 95, '🍃', '100 bags', 76],
    ['Energy Drink 250ml', 'Sting', 100, 0, 4.2, 400, 300, '⚡', '250 ml', 83],
  ],
  bakery: [
    ['Fresh Sandwich Bread Large', 'Dawn', 160, 0, 4.6, 360, 100, '🍞', '1 loaf', 96],
    ['Cake Rusk Original 12 pcs', 'Bisconni', 220, 250, 4.5, 190, 130, '🥖', '12 pcs', 84],
    ['Chocolate Truffle Cake 1 lb', 'Bake House', 1450, 1600, 4.8, 120, 12, '🎂', '1 lb', 77],
    ['Butter Croissant Pack of 4', 'Bake House', 480, 0, 4.4, 80, 40, '🥐', '4 pcs', 69],
    ['Baking Powder 100g', 'Dr. Oetker', 160, 180, 4.5, 90, 110, '🧁', '100 g', 54],
    ['Fruit Cake Slice Pack of 6', 'Gourmet', 360, 0, 4.3, 105, 70, '🍰', '6 pcs', 63],
  ],
  'home-accessories': [
    ['Decorative Wall Clock 14 inch', 'Time & Co', 1850, 2200, 4.4, 60, 22, '🕰️', '1 piece', 61],
    ['Storage Basket Set of 3', 'HomeCraft', 1590, 0, 4.5, 72, 34, '🧺', '3 pcs', 68],
    ['Cotton Bed Sheet Double', 'Bonanza Home', 2490, 2900, 4.6, 130, 28, '🛏️', '1 set', 74],
    ['LED Table Lamp Rechargeable', 'Lumen', 1750, 1990, 4.3, 90, 41, '💡', '1 piece', 66],
    ['Photo Frame Set of 4', 'Artline', 990, 0, 4.2, 48, 50, '🖼️', '4 pcs', 50],
    ['Floor Doormat Anti-Slip', 'HomeCraft', 590, 650, 4.1, 66, 75, '🚪', '1 piece', 48],
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
