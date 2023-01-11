/** @type {import('tailwindcss').Config} */
paths = [
  "./pages/**/*.tsx",
  "./components/**/*.tsx",
  "./layouts/**/*.tsx"
]
module.exports = {
  content: paths,
  theme: {
    extend: {},
  },
  darkMode: 'class',
  variants: {
    typography: ['dark']
  },
  plugins: [require('@tailwindcss/typography')],
}