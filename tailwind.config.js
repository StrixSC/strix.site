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
    variants: {
        typography: ['dark']
    },
    // eslint-disable-next-line global-require
    plugins: [require('@tailwindcss/typography')]
};
