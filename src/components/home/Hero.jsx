import { motion } from 'framer-motion';
import { Sparkles, Truck } from 'lucide-react';
import Button from '../common/Button.jsx';
import HeroArt from '../common/HeroArt.jsx';

const floaters = [
  { emoji: '🍎', cls: 'left-[2%] top-[8%]', delay: '0s' },
  { emoji: '🥛', cls: 'right-[6%] top-[4%]', delay: '0.6s' },
  { emoji: '🍞', cls: 'left-[8%] bottom-[10%]', delay: '1.2s' },
  { emoji: '🧴', cls: 'right-[2%] bottom-[22%]', delay: '0.3s' },
  { emoji: '🏏', cls: 'left-[40%] top-[0%]', delay: '0.9s' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream to-brand/15">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-8 py-12 lg:grid-cols-2 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-1.5 text-xs font-bold text-brand shadow-sm">
            <Sparkles className="h-4 w-4" /> Pakistan's all-in-one supermart
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] sm:text-5xl xl:text-6xl">
            Everything You Need, <span className="text-brand sm:whitespace-nowrap">All in One Place!</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/70 sm:text-lg">
            From daily groceries and snacks to beauty, sports, stationery and home essentials — shop smart prices, trusted brands and convenient delivery, all under one roof.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/shop" size="lg">Shop Now</Button>
            <Button to="/categories" size="lg" variant="outline">Explore Categories</Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-semibold text-ink/70">
            <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-brand" />Free delivery over Rs. 3,000</span>
            <span className="flex items-center gap-2">💵 Cash on Delivery</span>
          </div>
        </motion.div>

        <motion.div className="relative mx-auto flex h-[22rem] w-full max-w-lg items-center justify-center sm:h-[28rem]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
          <div className="absolute inset-8 rounded-full bg-brand/10" aria-hidden="true" />
          <div className="absolute inset-16 rounded-full bg-brand/10 blur-2xl" aria-hidden="true" />
          <HeroArt className="relative h-full w-full max-h-[26rem] animate-float" />

          {floaters.map((f) => (
            <span key={f.emoji} className={`absolute animate-float text-3xl drop-shadow-lg sm:text-4xl ${f.cls}`} style={{ animationDelay: f.delay }} aria-hidden="true">{f.emoji}</span>
          ))}

          <div className="absolute -left-1 top-8 -rotate-6 rounded-2xl bg-brand px-4 py-2 text-center text-white shadow-lift">
            <p className="text-xl font-extrabold leading-none">30%</p>
            <p className="text-[10px] font-bold uppercase tracking-wider">off deals</p>
          </div>
          <div className="absolute -right-1 bottom-10 rotate-6 rounded-2xl border border-ink/10 bg-surface px-4 py-2 shadow-lift">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Fresh daily</p>
            <p className="text-sm font-extrabold">12 categories</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
