import { Heart, Handshake, Leaf, Store } from 'lucide-react';
import HeroArt from '../components/common/HeroArt.jsx';
import Button from '../components/common/Button.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';

const values = [
  { icon: Handshake, title: 'Reliable service', text: 'We show up every day and look after our customers.' },
  { icon: Leaf, title: 'Fresh & honest', text: 'Clearly labelled products and fair prices — no surprises at the till.' },
  { icon: Heart, title: 'Community first', text: 'A neighbourhood store at heart, now available online.' },
];

export default function About() {
  return (
    <>
      <section className="bg-gradient-to-br from-cream to-brand/15">
        <div className="container-page grid items-center gap-8 py-14 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand"><Store className="h-4 w-4" />About us</p>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Everything You Need Under One Roof.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
              ALI HASSAN SUPERMART brings groceries, snacks, beauty, personal care, sports, stationery, kitchenware, frozen foods, cleaning supplies, drinks, bakery and home accessories together in one friendly store.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-ink/70">
              Our promise is simple: a wide range, fair prices and dependable delivery, so your weekly shop takes minutes instead of hours.
            </p>
            <Button to="/shop" size="lg" className="mt-6">Start Shopping</Button>
          </div>
          <div className="flex justify-center"><HeroArt className="h-80 w-80" /></div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-surface p-6 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <WhyChooseUs />
    </>
  );
}
