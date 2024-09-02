/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rbt': ['Roboto', 'sans-serif']
      },
      colors: {
        'purple': '#9b379b'
      }
      
    },
  },
  plugins: [],
}

