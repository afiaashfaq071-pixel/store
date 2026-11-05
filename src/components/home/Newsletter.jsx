import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { api, isSupabaseEnabled } from '../../lib/supabase.js';

/**
 * Newsletter sign-up. With the database on, the address is validated, saved once (duplicates are
 * recognised by the server) and only then confirmed. Without a database nothing can be saved, and
 * the form says so instead of pretending.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const { showToast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(clean)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!isSupabaseEnabled) {
      setNotice('Newsletter sign-up is not connected in this demo, so no email was saved.');
      showToast('Demo mode: sign-up is not connected — nothing was saved', 'info');
      return;
    }
    setBusy(true);
    try {
      const result = await api('rpc/subscribe_newsletter', { method: 'POST', body: { p_email: clean } });
      setDone(result === 'already' ? 'already' : 'new');
      setEmail('');
      setNotice('');
    } catch (err) {
      showToast(`Could not subscribe: ${err.message}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-page py-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-charcoal ring-1 ring-white/10 px-6 py-12 text-center text-white sm:px-12">
        <Mail className="mx-auto h-10 w-10 text-gold" />
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Join Our Mailing List, Get Rs. 200 Off</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">Subscribe for weekly deals, new arrivals and coupon codes straight to your inbox.</p>
        {done ? (
          <p className="mt-6 font-semibold text-gold" role="status">
            {done === 'already' ? 'This email is already on the list.' : "You're on the list!"} Use code SAVE200 on orders above Rs. 2,000.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-full border-0 bg-surface-raised px-5 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand" />
            <button type="submit" disabled={busy} className="rounded-full bg-brand px-7 py-3 text-sm font-bold hover:bg-brand-dark disabled:opacity-60">{busy ? 'Saving…' : 'Subscribe'}</button>
          </form>
        )}
        {notice && <p className="mt-4 text-xs text-white/70" role="status">{notice}</p>}
      </div>
    </section>
  );
}
