import { loadFromStorage, saveToStorage } from './storage.js';
import { sanitizeOrders } from './storedData.js';

// A small copy of the orders placed on THIS device, so the confirmation page still works after a
// refresh. (With the database on, customers cannot read the orders table, so this is how they get
// their own order back.) Damaged data is cleaned by sanitizeOrders instead of crashing the page.
const KEY = 'ahs_my_orders_v1';
const MAX_KEPT = 20;

export const loadMyOrders = () => sanitizeOrders(loadFromStorage(KEY, []), []);

/** Returns true when saved, false when the browser refused (e.g. storage full). */
export const saveMyOrder = (order) => {
  const rest = loadMyOrders().filter((o) => o.id !== order.id);
  return saveToStorage(KEY, [order, ...rest].slice(0, MAX_KEPT));
};

export const getMyOrder = (id) => loadMyOrders().find((o) => o.id === id) || null;