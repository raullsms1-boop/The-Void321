/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: 'oklch(0.5 0.2 15)',
        'crimson-light': 'oklch(0.6 0.2 15)',
        gold: 'oklch(0.75 0.12 80)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [require('tw-animate-css')],
}
