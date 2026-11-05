import { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useSettings from '../hooks/useSettings.js';
import { sendEmail } from '../utils/notify.js';

export default function Contact() {
  const { showToast } = useToast();
  const { ownerContact } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Messages are delivered to the store email set in Admin → Settings. Without it nothing can be sent.
  const canSend = Boolean(ownerContact.email);
  const info = [
    { icon: MapPin, title: 'Visit us', text: 'Main Boulevard, Lahore, Pakistan (sample address)' },
    { icon: Phone, title: 'Call us', text: ownerContact.phone || '+92 300 0000000 (sample number)' },
    { icon: Mail, title: 'Email', text: ownerContact.email || 'hello@alihassansupermart.pk (sample address)' },
    { icon: Clock, title: 'Opening hours', text: 'Daily, 9:00 AM – 11:00 PM' },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!canSend) {
      showToast('Message sending is unavailable: the store has no email set up yet.', 'error');
      return;
    }
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim()) || form.message.trim().length < 5) {
      showToast('Please complete all fields with a valid email', 'error');
      return;
    }
    setSending(true);
    try {
      await sendEmail(ownerContact.email, `Website message from ${form.name.trim()}`, `From: ${form.name.trim()} <${form.email.trim()}>\n\n${form.message.trim()}`);
      setForm({ name: '', email: '', message: '' });
      showToast('Message sent. We will reply by email.', 'success');
    } catch (err) {
      // The text stays in the form so nothing the customer typed is lost.
      showToast(`Your message could not be sent (${err.message}). Please try again.`, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-extrabold">Contact Us</h1>
      <p className="mt-2 text-ink/60">Questions about an order or a product? Our team is here to help.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {info.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon className="h-6 w-6" /></span>
              <div><p className="font-bold">{title}</p><p className="text-sm text-ink/60">{text}</p></div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl bg-surface p-6 shadow-soft sm:p-8">
          <div>
            <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">Name</label>
            <input id="c-name" className="input-field" value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold">Email</label>
            <input id="c-email" type="email" className="input-field" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label htmlFor="c-msg" className="mb-1.5 block text-sm font-semibold">Message</label>
            <textarea id="c-msg" rows={5} className="input-field" value={form.message} onChange={set('message')} />
          </div>
          <Button type="submit" size="lg" disabled={sending || !canSend}>{sending ? 'Sending…' : 'Send Message'}</Button>
          {!canSend && <p className="text-sm text-red-500" role="status">Message sending is unavailable right now because the store has not set an email address. Please call or visit us instead.</p>}
        </form>
      </div>
    </div>
  );
}
