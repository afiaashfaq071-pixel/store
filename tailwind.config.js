/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme tokens
        cream: { DEFAULT: '#0F1117', dark: '#161922' }, // page background
        surface: { DEFAULT: '#1A1D27', raised: '#222634' }, // cards, panels, inputs
        ink: { DEFAULT: '#F3F4F6' }, // primary text (use ink/60 etc. for muted text and borders)
        charcoal: { DEFAULT: '#0B0D13', 700: '#232734', 600: '#2D3140', 500: '#3F4456' }, // deepest bands
        brand: { DEFAULT: '#FF8A35', dark: '#E8741F', light: '#FFB27A' },
        gold: { DEFAULT: '#FFD166', dark: '#F2B83B' },
        success: { DEFAULT: '#36B37E', dark: '#5BD9A4' },
      },
      fontFamily: {
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.35)',
        lift: '0 0 0 1px rgba(255,255,255,0.08), 0 18px 40px rgba(0,0,0,0.5)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseDot: { '0%,100%': { opacity: 0.25, transform: 'scale(0.8)' }, '50%': { opacity: 1, transform: 'scale(1.15)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 4s ease-in-out infinite',
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
