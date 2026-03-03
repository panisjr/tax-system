/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // use the CSS variables driven by next/font/google
        lexend: ['var(--font-lexend)'],
        inter: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
