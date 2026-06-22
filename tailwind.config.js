/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        court: {
          50: '#effdf6',
          100: '#d9f9e9',
          200: '#b5f1d4',
          300: '#80e4b8',
          400: '#45cf95',
          500: '#1eb87a',
          600: '#119463',
          700: '#0f7651',
          800: '#105e43',
          900: '#0e4d39',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
