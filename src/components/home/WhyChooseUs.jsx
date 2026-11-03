import { BadgePercent, Headphones, ShieldCheck, ShoppingBasket } from 'lucide-react';
import SectionHeading from '../common/SectionHeading.jsx';

const reasons = [
  { icon: ShieldCheck, title: 'Quality Products', text: 'Trusted brands, checked for freshness and expiry before they reach you.' },
  { icon: BadgePercent, title: 'Affordable Prices', text: 'Everyday low prices and weekly deals across every aisle.' },
  { icon: ShoppingBasket, title: 'Convenient Shopping', text: 'Twelve categories in one cart — and Cash on Delivery at your door.' },
  { icon: Headphones, title: 'Friendly Support', text: 'Our team is a call or message away, seven days a week.' },
];

export default function WhyChooseUs() {
  return (
    <section className="container-page py-14">
      <SectionHeading align="center" eyebrow="Why us" title="Why Choose ALI HASSAN SUPERMART?" subtitle="Everything for your everyday shopping." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-3xl bg-surface p-6 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand"><Icon className="h-7 w-7" /></span>
            <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
