import { formatPKR } from '../../utils/format.js';

/** Lightweight dependency-free bar chart. data: [{ label, value }] */
export default function BarChart({ data, height = 180 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }} role="img" aria-label="Bar chart">
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-semibold text-ink/50">{d.value ? formatPKR(d.value).replace('Rs. ', '') : ''}</span>
          <div className="w-full rounded-t-lg bg-gradient-to-t from-brand to-gold transition-all" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 4 : 2, opacity: d.value ? 1 : 0.2 }} title={`${d.label}: ${formatPKR(d.value)}`} />
          <span className="text-[11px] font-medium text-ink/60">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
