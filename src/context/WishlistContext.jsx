import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProductContext } from './ProductContext.jsx';
import { CartContext } from './CartContext.jsx';
import { useToast } from './ToastContext.jsx';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

export const WishlistContext = createContext(null);

const KEY = 'ahs_wishlist_v1';

export function WishlistProvider({ children }) {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const [ids, setIds] = useState(() => loadFromStorage(KEY, []));

  useEffect(() => saveToStorage(KEY, ids), [ids]);

  const items = useMemo(() => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean), [ids, products]);

  const isInWishlist = useCallback((id) => ids.includes(id), [ids]);

  const toggleWishlist = useCallback(
    (product) => {
      const exists = ids.includes(product.id);
      setIds((prev) => (exists ? prev.filter((x) => x !== product.id) : [...prev, product.id]));
      showToast(exists ? 'Removed from wishlist' : `${product.name} saved to wishlist`, exists ? 'info' : 'success');
    },
    [ids, showToast]
  );

  const removeFromWishlist = useCallback((id) => setIds((prev) => prev.filter((x) => x !== id)), []);

  const moveToCart = useCallback(
    (product) => {
      if (addToCart(product, 1)) setIds((prev) => prev.filter((x) => x !== product.id));
    },
    [addToCart]
  );

  const clearWishlist = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, isInWishlist, toggleWishlist, removeFromWishlist, moveToCart, clearWishlist }),
    [items, isInWishlist, toggleWishlist, removeFromWishlist, moveToCart, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
