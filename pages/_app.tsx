// pages/_app.js
import 'tailwindcss/tailwind.css';
import { Inter } from '@next/font/google';

const inter = Inter();

const MyApp = ({ Component, pageProps }): any => {
    return (
        <main className={inter.className}>
            <Component {...pageProps} />;
        </main>
    );
};

export default MyApp;
