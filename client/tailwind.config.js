/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00ff9d',
        'code-bg': '#1E1E1E',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal': '5px 5px 0px #000',
        'brutal-hover': '7px 7px 0px #000',
      },
    },
  },
  plugins: [],
}