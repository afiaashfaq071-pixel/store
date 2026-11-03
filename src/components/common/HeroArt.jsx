/** Brand illustration: two shopping bags. Pure SVG, no image files. */
export default function HeroArt({ className = 'h-72 w-72' }) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="Two shopping bags">
      <ellipse cx="160" cy="304" rx="120" ry="10" fill="#000" opacity=".35" />

      {/* back bag */}
      <path d="M205 150 H292 L284 300 H214 Z" fill="#2D3140" />
      <path d="M205 150 H292 L291 172 H206 Z" fill="#3F4456" />
      <path d="M232 150 V132 a17 17 0 0 1 34 0 V150" fill="none" stroke="#FF8A35" strokeWidth="7" strokeLinecap="round" />
      <circle cx="249" cy="232" r="16" fill="#FFD166" />
      <path d="M241 233 l6 6 l12 -13" fill="none" stroke="#171923" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* main bag */}
      <path d="M52 104 H238 L224 298 H66 Z" fill="#FF8A35" />
      <path d="M52 104 H238 L236 134 H54 Z" fill="#E8741F" />
      <path d="M105 104 V82 a40 40 0 0 1 80 0 V104" fill="none" stroke="#FFD166" strokeWidth="11" strokeLinecap="round" />
      <path d="M112 262 L145 188 L178 262 M124 236 H166" fill="none" stroke="#171923" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
