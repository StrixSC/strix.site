/** @type {import('tailwindcss').Config} */
const paths = ['./pages/**/*.tsx', './components/**/*.tsx', './layouts/**/*.tsx'];
module.exports = {
    content: paths,
    fontFamily: {
        sans: 'Inter'
    },
    safelist: ['md:grid-cols-3', 'md:grid-cols-4', 'lg:grid-cols-3', 'lg:grid-cols-4'],
    // eslint-disable-next-line global-require
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: [
            'light',
            'dark',
            {
                showdown: {
                    primary: '#38bdf8',
                    secondary: '#e11d48',
                    accent: '#2563eb',
                    neutral: '#3D4451',
                    'base-100': '#FFFFFF',
                    info: '#9ca3af',
                    success: '#36D399',
                    warning: '#FBBD23',
                    error: '#F87272'
                }
            },
            'cupcake',
            'bumblebee',
            'emerald',
            'corporate',
            'synthwave',
            'retro',
            'cyberpunk',
            'valentine',
            'halloween',
            'garden',
            'forest',
            'aqua',
            'lofi',
            'pastel',
            'fantasy',
            'wireframe',
            'black',
            'luxury',
            'dracula',
            'cmyk',
            'autumn',
            'business',
            'acid',
            'lemonade',
            'night',
            'coffee',
            'winter'
        ]
    }
};
