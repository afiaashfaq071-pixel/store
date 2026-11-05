import { useMemo } from 'react';
import { Check, MessageCircle, MessageSquare } from 'lucide-react';
import useOrders from '../../hooks/useOrders.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { FOLLOW_UP_DAYS, buildFollowUpMessage, daysSince, isFollowUpDue, smsLink, whatsappLink } from '../../utils/notify.js';

/**
 * Customers whose order is 15+ days old get a friendly "happy" message.
 * The site has no server, so the message opens ready-written in WhatsApp / SMS and the owner taps send.
 */
export default function AdminFollowUps() {
  const { orders, markFollowUpSent } = useOrders();
  const { showToast } = useToast();

  const due = useMemo(() => orders.filter(isFollowUpDue).sort((a, b) => a.createdAt - b.createdAt), [orders]);
  const upcoming = useMemo(
    () => orders.filter((o) => o.status !== 'Cancelled' && !o.followUpSent && !isFollowUpDue(o)).sort((a, b) => a.createdAt - b.createdAt),
    [orders]
  );
  const doneCount = orders.filter((o) => o.followUpSent).length;

  const markDone = (o) => {
    markFollowUpSent(o.id);
    showToast(`Marked ${o.customer.name} as messaged`, 'info');
  };

  const itemsText = (o) => o.items.map((i) => `${i.name} × ${i.qty}`).join(', ');

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-ink/60">
        {FOLLOW_UP_DAYS} days after a customer's order, send them a short happy message. Tap WhatsApp or SMS — the message is already written for you — then press “Mark as sent”.
        {' '}{doneCount} customer{doneCount === 1 ? '' : 's'} already messaged.
      </p>

      <section className="rounded-3xl bg-surface p-4 shadow-soft sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-extrabold">Ready to message <Badge tone={due.length ? 'gold' : 'success'}>{due.length}</Badge></h2>
        {due.length === 0 ? (
          <p className="text-sm text-ink/50">Nobody is due right now — great!</p>
        ) : (
          <ul className="space-y-3">
            {due.map((o) => {
              const text = buildFollowUpMessage(o);
              return (
                <li key={o.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-cream p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{o.customer.name} <span className="font-normal text-ink/50">· {o.customer.phone}</span></p>
                    <p className="truncate text-xs text-ink/60">{o.id} · {daysSince(o.createdAt)} days ago · {itemsText(o)}</p>
                  </div>
                  <a href={whatsappLink(o.customer.phone, text)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-xs font-semibold text-white transition hover:bg-success-dark">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp
                  </a>
                  <a href={smsLink(o.customer.phone, text)} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-surface px-4 py-2 text-xs font-semibold transition hover:border-brand hover:text-brand">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />SMS
                  </a>
                  <Button size="sm" variant="dark" icon={Check} onClick={() => markDone(o)}>Mark as sent</Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-surface p-4 shadow-soft sm:p-6">
        <h2 className="mb-4 font-extrabold">Coming up</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-ink/50">No other customers are waiting.</p>
        ) : (
          <ul className="divide-y divide-ink/5 text-sm">
            {upcoming.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span><b>{o.customer.name}</b> <span className="text-ink/50">· {o.id}</span></span>
                <span className="text-xs text-ink/60">message in {Math.max(1, FOLLOW_UP_DAYS - daysSince(o.createdAt))} day(s)</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
