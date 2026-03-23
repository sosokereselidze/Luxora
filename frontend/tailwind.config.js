/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          light: '#f5f5f5',
          gold: '#d4af37',
          deep: '#1a1a1a',
          purple: '#4a0e4e',
          'purple-light': '#8e44ad',
        }
      },
      fontFamily: {
        luxury: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
