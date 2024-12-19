/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'code-bg': '#1E1E1E',
        'primary': '#3B82F6',
        'secondary': '#10B981'
      }
    },
  },
  plugins: [],
}