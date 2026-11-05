// Message helpers: order details for the owner, follow-up messages for customers,
// WhatsApp / SMS links and the (free) email sender.
import { formatPKR } from './format.js';

export const FOLLOW_UP_DAYS = 15;
const DAY = 86400000;

/** Turns 0300-1234567 / +92 300 1234567 into 923001234567 (digits only, country code first). */
export const normalizePhone = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  return digits;
};

export const whatsappLink = (phone, text) => `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
export const smsLink = (phone, text) => `sms:+${normalizePhone(phone)}?body=${encodeURIComponent(text)}`;

/** Plain-text order summary sent to the owner. */
export const buildOrderMessage = (order) => {
  const lines = order.items.map((i) => `• ${i.name} × ${i.qty} = ${formatPKR(i.price * i.qty)}`);
  return [
    `NEW ORDER ${order.id} — Ali Hassan Supermart`,
    '',
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.city}`,
    order.customer.notes ? `Note: ${order.customer.notes}` : null,
    '',
    'Items:',
    ...lines,
    '',
    `Subtotal: ${formatPKR(order.subtotal)}`,
    order.discount > 0 ? `Discount: -${formatPKR(order.discount)}${order.coupon ? ` (${order.coupon})` : ''}` : null,
    `Delivery: ${order.deliveryFee ? formatPKR(order.deliveryFee) : 'Free'}`,
    `TOTAL (Cash on Delivery): ${formatPKR(order.total)}`,
  ]
    .filter((l) => l !== null)
    .join('\n');
};

/** Friendly "thank you" message for customers, sent about 15 days after their order. */
export const buildFollowUpMessage = (order) =>
  `Assalam o Alaikum ${order.customer.name}! 😊 Thank you for shopping with Ali Hassan Supermart. ` +
  `It has been ${FOLLOW_UP_DAYS} days since your order ${order.id} — we hope you are enjoying your items! ` +
  'If there is anything we can do better, just reply to this message. We would love to see you again soon. 🛍️';

export const daysSince = (timestamp) => Math.floor((Date.now() - timestamp) / DAY);

export const isFollowUpDue = (order) =>
  order.status !== 'Cancelled' && !order.followUpSent && Date.now() - order.createdAt >= FOLLOW_UP_DAYS * DAY;

/**
 * Sends an email through FormSubmit (free, no account or server needed).
 * The first message to a new address makes FormSubmit email a one-time "Activate" link to that address.
 */
export const sendEmail = async (email, subject, message) => {
  const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: subject, _captcha: 'false', _template: 'box', message }),
  });
  if (!res.ok) throw new Error(`Email service answered ${res.status}`);
  return res.json();
};

export const sendOrderEmail = (email, order) => sendEmail(email, `New order ${order.id} — Rs. ${Math.round(order.total)}`, buildOrderMessage(order));
