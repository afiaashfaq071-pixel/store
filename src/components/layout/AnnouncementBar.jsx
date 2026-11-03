import { announcements } from '../../data/banners.js';

/** Scrolling promo strip. Content is duplicated so the marquee loops seamlessly. */
export default function AnnouncementBar() {
  const loop = [...announcements, ...announcements];
  return (
    <div className="overflow-hidden bg-charcoal py-2 text-xs font-medium text-white sm:text-sm" role="region" aria-label="Announcements">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap hover:[animation-play-state:paused]">
        {loop.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-16">
            <span>{text}</span>
            <span className="text-gold" aria-hidden="true">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
