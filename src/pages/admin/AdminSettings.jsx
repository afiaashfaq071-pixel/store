import { useState } from 'react';
import { KeyRound, Mail, Phone, RotateCcw, Send } from 'lucide-react';
import useSettings from '../../hooks/useSettings.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import { MIN_KEY_LENGTH, setAdminKey } from '../../utils/adminKey.js';
import { sendEmail } from '../../utils/notify.js';
import { isSupabaseEnabled } from '../../lib/supabase.js';

const phoneRe = /^(\+92|0)?3\d{2}[- ]?\d{7}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Owner contact (where new-order details go) + change of the owner key. */
export default function AdminSettings() {
  const { ownerContact, saveOwnerContact, resetOwnerContact } = useSettings();
  const { showToast } = useToast();
  const [form, setForm] = useState({ phone: ownerContact.phone, email: ownerContact.email });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [keyForm, setKeyForm] = useState({ next: '', confirm: '' });
  const [keyError, setKeyError] = useState('');

  const saved = Boolean(ownerContact.phone || ownerContact.email);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const err = {};
    const phone = form.phone.trim();
    const email = form.email.trim();
    if (!phone && !email) err.form = 'Enter a phone number, an email, or both.';
    if (phone && !phoneRe.test(phone)) err.phone = 'Enter a valid Pakistani mobile number, e.g. 0300-1234567';
    if (email && !emailRe.test(email)) err.email = 'Enter a valid email address.';
    setErrors(err);
    if (Object.keys(err).length) return;
    try {
      await saveOwnerContact({ phone, email });
      showToast('Owner contact saved');
    } catch (error) {
      showToast(`Could not save: ${error.message}`, 'error');
    }
  };

  const reset = async () => {
    if (!saved) return;
    if (window.confirm('Delete the saved phone number and email? New orders will no longer be sent anywhere until you save new details.')) {
      try {
        await resetOwnerContact();
        setForm({ phone: '', email: '' });
        setErrors({});
        showToast('Phone number and email deleted', 'info');
      } catch (error) {
        showToast(`Could not delete: ${error.message}`, 'error');
      }
    }
  };

  const sendTest = async () => {
    if (!ownerContact.email) return showToast('Save an email address first', 'error');
    setSending(true);
    try {
      await sendEmail(ownerContact.email, 'Test message — Ali Hassan Supermart', 'This is a test. Order details will arrive at this address.');
      showToast('Test email sent — check your inbox (and spam)', 'success');
    } catch {
      showToast('Could not send the test email. Check your internet connection.', 'error');
    } finally {
      setSending(false);
    }
  };

  const changeKey = (e) => {
    e.preventDefault();
    setKeyError('');
    if (keyForm.next.trim().length < MIN_KEY_LENGTH) return setKeyError(`Use at least ${MIN_KEY_LENGTH} characters.`);
    if (keyForm.next !== keyForm.confirm) return setKeyError('The two keys do not match.');
    if (!setAdminKey(keyForm.next)) return setKeyError('Could not save the key in this browser.');
    setKeyForm({ next: '', confirm: '' });
    showToast('Owner key changed');
  };

  return (
    <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-lg font-extrabold"><Phone className="h-5 w-5 text-brand" />Owner contact</h2>
        <p className="mt-1 text-sm text-ink/60">Whenever a customer places an order, all the details (customer, address, items, total) are sent to the email below. With the WhatsApp number saved, the order confirmation screen shows a button that opens WhatsApp with the order message already written; the customer must press send, so messages are never delivered automatically.</p>

        <form onSubmit={save} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor="oc-phone" className="mb-1 block text-sm font-semibold">Store WhatsApp number</label>
            <input id="oc-phone" className="input-field" value={form.phone} onChange={set('phone')} placeholder="0300-1234567" inputMode="tel" />
            {errors.phone && <p className="mt-1 text-xs text-red-500" role="alert">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="oc-email" className="mb-1 block text-sm font-semibold">Email</label>
            <input id="oc-email" type="email" className="input-field" value={form.email} onChange={set('email')} placeholder="owner@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500" role="alert">{errors.email}</p>}
          </div>
          {errors.form && <p className="text-sm text-red-500" role="alert">{errors.form}</p>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" icon={Mail}>Save</Button>
            <Button variant="outline" icon={Send} onClick={sendTest} disabled={sending || !ownerContact.email}>{sending ? 'Sending…' : 'Send test email'}</Button>
            <Button variant="danger" icon={RotateCcw} onClick={reset} disabled={!saved}>Reset</Button>
          </div>
        </form>

        <p className="mt-4 rounded-xl bg-gold/20 p-3 text-xs text-ink/70">
          The first email to a new address comes with a one-time “Activate” link from the FormSubmit service — open it once, then all orders arrive normally. Reset deletes both the phone number and the email completely.
        </p>
      </section>

      {!isSupabaseEnabled && (
      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-lg font-extrabold"><KeyRound className="h-5 w-5 text-brand" />Change owner key</h2>
        <p className="mt-1 text-sm text-ink/60">The key that opens this admin area.</p>
        <form onSubmit={changeKey} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor="ok-new" className="mb-1 block text-sm font-semibold">New key</label>
            <input id="ok-new" type="password" autoComplete="new-password" className="input-field" value={keyForm.next} onChange={(e) => setKeyForm((f) => ({ ...f, next: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="ok-confirm" className="mb-1 block text-sm font-semibold">Repeat new key</label>
            <input id="ok-confirm" type="password" autoComplete="new-password" className="input-field" value={keyForm.confirm} onChange={(e) => setKeyForm((f) => ({ ...f, confirm: e.target.value }))} />
          </div>
          {keyError && <p className="text-sm text-red-500" role="alert">{keyError}</p>}
          <Button type="submit" variant="outline" icon={KeyRound}>Change key</Button>
        </form>
      </section>
      )}
    </div>
  );
}
