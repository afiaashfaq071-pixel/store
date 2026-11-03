export default function StatCard({ icon: Icon, label, value, hint, tone = 'bg-brand/10 text-brand' }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="h-6 w-6" /></span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</p>
        <p className="truncate text-2xl font-extrabold">{value}</p>
        {hint && <p className="text-xs text-ink/50">{hint}</p>}
      </div>
    </div>
  );
}
