/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#875cf5',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
