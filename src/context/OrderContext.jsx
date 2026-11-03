import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

export const OrderContext = createContext(null);

const KEY = 'ahs_orders_v1';

// Demo orders so the admin dashboard has data on first run.
const day = 86400000;
const now = Date.now();
const demoOrders = [
  { id: 'AHS-10021', customer: { name: 'Ayesha Khan', phone: '0300-1234567', city: 'Lahore', address: 'House 12, Gulberg III' }, items: [{ id: 3, name: 'Premium Tea Leaves 950g', qty: 2, price: 1180 }], subtotal: 2360, discount: 0, deliveryFee: 199, total: 2559, status: 'Delivered', createdAt: now - 6 * day },
  { id: 'AHS-10022', customer: { name: 'Bilal Raza', phone: '0321-7654321', city: 'Karachi', address: 'Flat 4B, Clifton Block 5' }, items: [{ id: 25, name: 'Kashmir Willow Cricket Bat', qty: 1, price: 4800 }], subtotal: 4800, discount: 480, deliveryFee: 0, total: 4320, status: 'Shipped', createdAt: now - 3 * day },
  { id: 'AHS-10023', customer: { name: 'Sana Malik', phone: '0333-9988776', city: 'Islamabad', address: 'Street 9, F-10/3' }, items: [{ id: 43, name: 'Washing Powder 2kg', qty: 3, price: 1190 }], subtotal: 3570, discount: 0, deliveryFee: 0, total: 3570, status: 'Processing', createdAt: now - 1 * day },
  { id: 'AHS-10024', customer: { name: 'Usman Tariq', phone: '0345-1122334', city: 'Rawalpindi', address: 'Saddar, Bank Road' }, items: [{ id: 38, name: 'Vanilla Ice Cream Family Tub 1L', qty: 2, price: 850 }], subtotal: 1700, discount: 0, deliveryFee: 199, total: 1899, status: 'Pending', createdAt: now - 4 * 3600000 },
];

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => loadFromStorage(KEY, demoOrders));

  useEffect(() => saveToStorage(KEY, orders), [orders]);

  const placeOrder = useCallback((order) => {
    const id = `AHS-${10000 + Math.floor(Math.random() * 89999)}`;
    const record = { ...order, id, status: 'Pending', createdAt: Date.now() };
    setOrders((list) => [record, ...list]);
    return record;
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  // Customers are derived from orders (grouped by phone number).
  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const key = o.customer.phone;
      const prev = map.get(key) || { ...o.customer, orders: 0, spent: 0, last: 0 };
      prev.orders += 1;
      if (o.status !== 'Cancelled') prev.spent += o.total;
      prev.last = Math.max(prev.last, o.createdAt);
      map.set(key, prev);
    });
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const value = useMemo(() => ({ orders, customers, placeOrder, updateOrderStatus }), [orders, customers, placeOrder, updateOrderStatus]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
