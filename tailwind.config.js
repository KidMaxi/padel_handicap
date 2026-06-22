/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep court greens
        court: {
          50: '#f0fbf5',
          100: '#dbf6e7',
          200: '#b9ecd0',
          300: '#86dcb1',
          400: '#4cc489',
          500: '#22a96b',
          600: '#158a56',
          700: '#126e47',
          800: '#12573a',
          900: '#0e4733',
          950: '#062a1e',
        },
        // Charcoal / ink for premium dark surfaces
        ink: {
          DEFAULT: '#0d1411',
          800: '#141d18',
          700: '#1b2620',
          600: '#28352d',
          400: '#5a6b61',
        },
        // Padel-ball neon accent
        ball: {
          DEFAULT: '#d7f24a',
          bright: '#e6ff5c',
          deep: '#bdd838',
        },
        line: '#eaf3ee',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(13,20,17,0.04), 0 10px 30px -12px rgba(13,20,17,0.15)',
        lift: '0 2px 6px rgba(13,20,17,0.06), 0 22px 48px -16px rgba(13,20,17,0.28)',
        glass: '0 10px 40px -10px rgba(6,42,30,0.45)',
        ball: '0 8px 24px -6px rgba(189,216,56,0.55)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.15rem',
        '3xl': '1.6rem',
        '4xl': '2.2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.2,0.7,0.2,1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        float: 'float 7s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
