/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sv-red': '#e50914',
        'sv-bg': '#0f0f0f',
        'sv-secondary': '#1a1a1a',
        'sv-card': '#212121',
        'sv-border': '#2a2a2a',
      },
    },
  },
  plugins: [],
}