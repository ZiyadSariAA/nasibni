/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6', // Purple
        background: '#FFFFFF',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        }
      },
    },
  },
  plugins: [],
}