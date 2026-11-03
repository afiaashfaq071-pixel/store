import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertCircle, Info, Check } from 'lucide-react';

const toneStyles = {
  success: { ring: 'border-success/40', icon: 'bg-success text-white' },
  error: { ring: 'border-red-500/40', icon: 'bg-red-500 text-white' },
  info: { ring: 'border-gold', icon: 'bg-gold text-charcoal' },
};

/** Toast stack. Rendered once by ToastProvider. */
export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const s = toneStyles[t.type] || toneStyles.success;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-surface p-3 pr-2 shadow-lift ${s.ring}`}
              role="status"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.icon}`}>
                {t.type === 'error' ? <AlertCircle className="h-5 w-5" /> : t.type === 'info' ? <Info className="h-5 w-5" /> : <Check className="h-5 w-5" />}
              </span>
              <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
              <button onClick={() => onDismiss(t.id)} className="rounded-full p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
