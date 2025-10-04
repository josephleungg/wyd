/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#F9CDCA', // light pink
        secondary: '#191E44', // dark blue
        tertiary: '#B85C71' // dark pink
      },
    },
  },
  plugins: [],
}