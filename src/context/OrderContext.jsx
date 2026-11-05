import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';
import { sanitizeOrders } from '../utils/storedData.js';
import { sendOrderEmail } from '../utils/notify.js';
import { ORDER_STATUSES, canTransition } from '../utils/orderStatus.js';
import { api, hasSession, isSupabaseEnabled } from '../lib/supabase.js';
import { ProductContext } from './ProductContext.jsx';
import { SettingsContext } from './SettingsContext.jsx';
import { useToast } from './ToastContext.jsx';

export { ORDER_STATUSES };

export const OrderContext = createContext(null);

const KEY = 'ahs_orders_v3';

// Two sample orders so the admin pages have something to show on first run (browser-only mode).
// The first one is old enough to appear in the "Follow-ups" list.
const day = 86400000;
const now = Date.now();
const demoOrders = [
  { id: 'AHS-10021', customer: { name: 'Ayesha Khan', phone: '0300-1234567', city: 'Lahore', address: 'House 12, Gulberg III' }, items: [{ id: 1, name: 'Premium Tea Leaves 950g', qty: 2, price: 1180 }], subtotal: 2360, discount: 0, deliveryFee: 199, total: 2559, status: 'Delivered', createdAt: now - 16 * day, followUpSent: false, stockRestored: false },
  { id: 'AHS-10023', customer: { name: 'Sana Malik', phone: '0333-9988776', city: 'Islamabad', address: 'Street 9, F-10/3' }, items: [{ id: 9, name: 'Washing Powder 2kg', qty: 3, price: 1190 }], subtotal: 3570, discount: 0, deliveryFee: 0, total: 3570, status: 'Processing', createdAt: now - 1 * day, followUpSent: false, stockRestored: false },
];

const fromRow = (r) => ({
  id: r.id,
  customer: r.customer,
  items: r.items,
  subtotal: Number(r.subtotal),
  discount: Number(r.discount),
  deliveryFee: Number(r.delivery_fee),
  total: Number(r.total),
  coupon: r.coupon,
  payment: r.payment,
  status: r.status,
  followUpSent: Boolean(r.follow_up_sent),
  stockRestored: Boolean(r.stock_restored),
  createdAt: new Date(r.created_at).getTime(),
});

export function OrderProvider({ children }) {
  const { ownerContact } = useContext(SettingsContext);
  const { products, refreshProducts, adjustStockLocal, adjustCouponUseLocal } = useContext(ProductContext);
  const { showToast } = useToast();
  const [orders, setOrders] = useState(() => (isSupabaseEnabled ? [] : sanitizeOrders(loadFromStorage(KEY, null), demoOrders)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  useEffect(() => {
    if (!isSupabaseEnabled) saveToStorage(KEY, orders);
  }, [orders]);

  /** Loads all orders from the database (owner only; does nothing for customers). */
  const refreshOrders = useCallback(async () => {
    if (!isSupabaseEnabled || !hasSession()) return;
    setLoading(true);
    setError('');
    try {
      const rows = await api('orders?select=*&order=created_at.desc');
      setOrders((rows || []).map(fromRow));
    } catch {
      setError('Could not load orders from the database.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Saves a new order. Resolves with the saved order and rejects (with a readable message) when it
   * cannot be saved, so the cart is only cleared after a real success.
   * With the database on, the server re-checks prices, stock, coupon and delivery fee itself.
   */
  const placeOrder = useCallback(
    async (order) => {
      order.items.forEach((i) => {
        const product = products.find((p) => p.id === i.id);
        if (!product) throw new Error('An item in your cart is no longer available. Please review your cart.');
        if (product.stock < i.qty) throw new Error(product.stock > 0 ? `Only ${product.stock} of "${product.name}" left in stock.` : `"${product.name}" is out of stock.`);
      });

      let record;
      if (isSupabaseEnabled) {
        const saved = await api('rpc/place_order', {
          method: 'POST',
          body: { p_order: { customer: order.customer, items: order.items.map((i) => ({ id: i.id, qty: i.qty })), coupon: order.coupon || null } },
        });
        record = { ...saved, followUpSent: false, stockRestored: false };
        refreshProducts(); // the database already reduced the stock; show the new numbers
      } else {
        let id = `AHS-${10000 + Math.floor(Math.random() * 89999)}`;
        while (ordersRef.current.some((o) => o.id === id)) id = `AHS-${10000 + Math.floor(Math.random() * 89999)}`;
        record = { ...order, id, status: 'Pending', createdAt: Date.now(), followUpSent: false, stockRestored: false };
        adjustStockLocal(record.items, -1);
        adjustCouponUseLocal(record.coupon, 1);
      }

      setOrders((list) => [record, ...list]);
      // Send the full order details to the owner's saved email (if one is saved).
      if (ownerContact.email) sendOrderEmail(ownerContact.email, record).catch((err) => console.warn('The order was saved, but the owner email could not be sent.', err));
      return record;
    },
    [products, refreshProducts, adjustStockLocal, adjustCouponUseLocal, ownerContact.email]
  );

  /**
   * Moves an order to a new status if the move is allowed (Pending → Confirmed → Processing →
   * Delivered, or Cancelled before delivery). Cancelling puts the stock back exactly once.
   * Returns { ok, message }.
   */
  const updateOrderStatus = useCallback(
    (id, status) => {
      const order = ordersRef.current.find((o) => o.id === id);
      if (!order) return { ok: false, message: 'Order not found.' };
      if (!canTransition(order.status, status)) return { ok: false, message: `An order cannot move from ${order.status} to ${status}.` };

      const restoreStock = status === 'Cancelled' && !order.stockRestored;
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status, stockRestored: o.stockRestored || restoreStock } : o)));

      if (isSupabaseEnabled) {
        api(`orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } })
          .then(() => restoreStock && refreshProducts())
          .catch((err) => {
            showToast(`Could not update the order: ${err.message}`, 'error');
            refreshOrders();
          });
      } else if (restoreStock) {
        adjustStockLocal(order.items, 1);
        adjustCouponUseLocal(order.coupon, -1);
      }
      return { ok: true, message: `${id} marked ${status}.` };
    },
    [adjustStockLocal, adjustCouponUseLocal, refreshProducts, refreshOrders, showToast]
  );

  const markFollowUpSent = useCallback(
    (id) => {
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, followUpSent: true } : o)));
      if (isSupabaseEnabled) {
        api(`orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: { follow_up_sent: true } }).catch(() => showToast('Could not save the change to the database.', 'error'));
      }
    },
    [showToast]
  );

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

  const value = useMemo(
    () => ({ orders, customers, loading, error, placeOrder, updateOrderStatus, markFollowUpSent, refreshOrders }),
    [orders, customers, loading, error, placeOrder, updateOrderStatus, markFollowUpSent, refreshOrders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
