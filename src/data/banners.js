export const announcements = [
  '🚚 Free delivery on orders above Rs. 3,000',
  'Use code WELCOME10 for 10% off your first order',
  '🔥 Weekend Mega Deals — up to 30% off selected items',
  '💳 Cash on Delivery available across Pakistan',
];

export const promoBanners = [
  { id: 1, title: 'Fresh Bakery Fest', subtitle: 'Up to 20% off on bread, rusks & cakes', cta: 'Shop Bakery', to: '/category/bakery', style: 'from-amber-400 to-orange-500', emoji: '🥐' },
  { id: 2, title: 'Cool Summer Treats', subtitle: 'Ice creams & cold drinks from Rs. 60', cta: 'Shop Frozen', to: '/category/ice-cream-frozen', style: 'from-sky-400 to-cyan-500', emoji: '🍨' },
  { id: 3, title: 'Back to School', subtitle: 'Notebooks, bags & stationery bundles', cta: 'Shop Stationery', to: '/category/stationery', style: 'from-indigo-500 to-violet-600', emoji: '🎒' },
];

export const coupons = {
  WELCOME10: { type: 'percent', value: 10, label: '10% off your order' },
  SAVE200: { type: 'flat', value: 200, label: 'Rs. 200 off', minSubtotal: 2000 },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free delivery' },
};

export const reviewSamples = [
  { name: 'Ayesha K.', rating: 5, text: 'Great quality and the price was better than my local shop. Delivery was on time.' },
  { name: 'Bilal R.', rating: 4, text: 'Fresh and well packed. Will order again.' },
  { name: 'Sana M.', rating: 5, text: 'Exactly as described. Highly recommended for monthly grocery.' },
  { name: 'Usman T.', rating: 4, text: 'Good value for money. Packaging could be slightly better.' },
];
