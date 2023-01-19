/** @type {import('tailwindcss').Config} */
const paths = ['./pages/**/*.tsx', './components/**/*.tsx', './layouts/**/*.tsx'];
module.exports = {
    content: paths,
    theme: {
        extend: {}
    },
    fontFamily: {
        sans: 'Inter'
    },
    darkMode: 'class',
    safelist: ['md:grid-cols-3', 'md:grid-cols-4', 'lg:grid-cols-3', 'lg:grid-cols-4'],
    // eslint-disable-next-line global-require
    plugins: [require('@tailwindcss/typography')]
};
