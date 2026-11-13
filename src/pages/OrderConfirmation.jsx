import { useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, MapPin, MessageCircle, ReceiptText, Wallet } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import NotFound from './NotFound.jsx';
import useOrders from '../hooks/useOrders.js';
import useSettings from '../hooks/useSettings.js';
import { formatPKR } from '../utils/format.js';
import { statusTone } from '../utils/adminStats.js';
import { getMyOrder } from '../utils/myOrders.js';
import { isSupabaseEnabled } from '../lib/supabase.js';
import { buildOrderMessage, whatsappLink } from '../utils/notify.js';

function AnimatedCheck({ reduce }) {
  return (
    <motion.div
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success ring-8 ring-success/10"
    >
      <svg viewBox="0 0 52 52" className="h-14 w-14" fill="none" aria-hidden="true">
        <motion.path
          d="M14 27 l8 8 16-17"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * Order confirmation + order details. It only opens for an order that really exists:
 * the live order list (demo mode / owner), the copy saved on this device, or the order that
 * Checkout just handed over. Refreshing the page keeps working because of the saved copy.
 */
export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { orders } = useOrders();
  const { ownerContact } = useSettings();
  const reduce = useReducedMotion();
  const detailsRef = useRef(null);

  const live = orders.find((o) => o.id === id);
  const order = useMemo(() => live || getMyOrder(id) || (location.state?.order?.id === id ? location.state.order : null), [live, id, location.state]);

  if (!order) return <NotFound message="We couldn't find this order on this device. Orders are only shown on the phone or computer that placed them." />;

  const fade = (delay) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.4 } });
  const viewOrder = () => {
    detailsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    detailsRef.current?.focus({ preventScroll: true });
  };
  const placedAt = new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <motion.section {...fade(0)} className="overflow-hidden rounded-3xl bg-surface text-center shadow-soft">
          <div className="bg-gradient-to-br from-brand/20 via-gold/10 to-transparent px-5 pb-8 pt-10 sm:px-10">
            <AnimatedCheck reduce={reduce} />
            <h1 className="mt-6 text-2xl font-extrabold leading-tight sm:text-4xl">Thank You for Shopping with Ali Hassan Supermart!</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink/70 sm:text-base">Your order has been placed successfully. We appreciate your trust and look forward to serving you again.</p>
            <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-surface px-4 py-2 text-sm shadow-soft">
              <span className="text-ink/60">Order ID</span><b className="tracking-wide text-brand">{order.id}</b>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/">Continue Shopping</Button>
              <Button variant="outline" icon={ReceiptText} onClick={viewOrder}>View My Order</Button>
            </div>
          </div>
        </motion.section>

        <motion.section {...fade(0.15)} ref={detailsRef} tabIndex={-1} id="order-details" aria-label="Order details" className="mt-6 scroll-mt-24 rounded-3xl bg-surface p-5 shadow-soft outline-none sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream p-4">
              <p className="flex items-center gap-2 text-sm font-bold"><CalendarClock className="h-4 w-4 text-brand" aria-hidden="true" />Placed on</p>
              <p className="mt-1 text-sm text-ink/70">{placedAt}</p>
              <p className="mt-3 text-sm font-bold">Order status</p>
              <p className="mt-1"><Badge tone={statusTone(order.status)}>{order.status}</Badge></p>
              {!live && <p className="mt-1 text-xs text-ink/50">Status as of when the order was placed.</p>}
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <p className="flex items-center gap-2 text-sm font-bold"><Wallet className="h-4 w-4 text-brand" aria-hidden="true" />Payment</p>
              <p className="mt-1 text-sm text-ink/70">Cash on Delivery</p>
              <p className="mt-3 text-sm font-bold">Payment status</p>
              <p className="mt-1"><Badge tone="gold">Pay on delivery</Badge></p>
            </div>
            <div className="rounded-2xl bg-cream p-4 sm:col-span-2">
              <p className="flex items-center gap-2 text-sm font-bold"><MapPin className="h-4 w-4 text-brand" aria-hidden="true" />Delivering to</p>
              <p className="mt-1 text-sm font-semibold">{order.customer.name}</p>
              <p className="text-sm text-ink/70">{order.customer.address}, {order.customer.city}, Pakistan</p>
              <p className="text-sm text-ink/70">Phone: {order.customer.phone}</p>
            </div>
          </div>

          <h2 className="mb-3 mt-7 text-lg font-extrabold">Your items</h2>
          <ul className="divide-y divide-ink/10 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-3 py-3">
                <span className="min-w-0"><span className="block font-semibold">{i.emoji ? `${i.emoji} ` : ''}{i.name}</span><span className="text-xs text-ink/60">{i.qty} × {formatPKR(i.price)}</span></span>
                <span className="shrink-0 font-bold">{formatPKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-dashed border-ink/20 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{formatPKR(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between"><dt className="text-ink/60">Discount{order.coupon ? ` (${order.coupon})` : ''}</dt><dd className="text-success">− {formatPKR(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-ink/60">Delivery</dt><dd>{order.deliveryFee > 0 ? formatPKR(order.deliveryFee) : 'Free'}</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-extrabold"><dt>Total (Cash on Delivery)</dt><dd className="text-brand">{formatPKR(order.total)}</dd></div>
          </dl>

          <p className="mt-6 text-sm text-ink/60">Please pay in cash when your order arrives. We will contact you on {order.customer.phone} if we need anything.</p>
          {ownerContact.phone && (
            <div className="mt-4">
              <a href={whatsappLink(ownerContact.phone, buildOrderMessage(order))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-success-dark">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />Send order on WhatsApp
              </a>
              <p className="mt-2 text-xs text-ink/50">WhatsApp opens with your order message already written. Nothing is sent until you press send there.</p>
            </div>
          )}
          {!isSupabaseEnabled && <p className="mt-4 rounded-xl bg-gold/20 p-3 text-xs text-ink/70">Demo store: this order is saved only in this browser. It is not sent to a real shop and no payment or delivery takes place.</p>}
        </motion.section>
      </div>
    </div>
  );
}