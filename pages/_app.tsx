// pages/_app.js
import 'tailwindcss/tailwind.css';

const MyApp = ({ Component, pageProps }): any => {
    return <Component {...pageProps} />;
};

export default MyApp;
