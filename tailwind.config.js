/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Example blue color
        'primary-foreground': '#ffffff', // White color for text on primary background
        secondary: '#6b7280', // Added secondary color
        input: '#d1d5db', // Example: gray-300 for input borders
        background: '#ffffff', // Example: white for background
      },
    },
  },
  plugins: [],
}
