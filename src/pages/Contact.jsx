import { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

const info = [
  { icon: MapPin, title: 'Visit us', text: 'Main Boulevard, Lahore, Pakistan' },
  { icon: Phone, title: 'Call us', text: '+92 300 0000000' },
  { icon: Mail, title: 'Email', text: 'hello@alihassansupermart.pk' },
  { icon: Clock, title: 'Opening hours', text: 'Daily, 9:00 AM – 11:00 PM' },
];

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) {
      showToast('Please complete all fields with a valid email', 'error');
      return;
    }
    setForm({ name: '', email: '', message: '' });
    showToast('Thanks! (Demo form — your message was not actually sent)', 'info');
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
          <Button type="submit" size="lg">Send Message</Button>
          <p className="text-xs text-ink/40">Demo form: no backend is connected, so messages are not delivered.</p>
        </form>
      </div>
    </div>
  );
}
