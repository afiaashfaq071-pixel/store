/** Loading indicator: three dots pulse in sequence. */
export default function Loader({ label = 'Loading…', fullScreen = false }) {
  const wrapper = fullScreen ? 'fixed inset-0 z-[90] bg-cream' : 'py-16';
  return (
    <div className={`${wrapper} flex flex-col items-center justify-center gap-4`} role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-3 w-3 animate-pulseDot rounded-full bg-brand" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <p className="text-sm font-medium text-ink/60">{label}</p>
    </div>
  );
}
