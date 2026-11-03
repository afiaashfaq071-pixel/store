/** Round icon badge used for empty / error / success states. */
export default function StateIllustration({ icon: Icon, tone = 'brand', className = '' }) {
  const tones = {
    brand: 'bg-brand/10 text-brand ring-brand/20',
    success: 'bg-success/10 text-success ring-success/20',
  };
  return (
    <span className={`flex h-24 w-24 items-center justify-center rounded-full ring-8 ${tones[tone]} ${className}`} aria-hidden="true">
      <Icon className="h-10 w-10" strokeWidth={1.75} />
    </span>
  );
}
