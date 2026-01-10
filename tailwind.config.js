/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'logistics-blue': '#0066CC',
        'logistics-orange': '#FF6600',
        'logistics-light-blue': '#E6F2FF',
        'logistics-light-orange': '#FFF4E6',
      },
    },
  },
  plugins: [],
}
