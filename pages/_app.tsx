// pages/_app.js
import 'tailwindcss/tailwind.css';
import { ThemeProvider } from 'next-themes';
import { Inter } from '@next/font/google';

const inter = Inter();

const MyApp = ({ Component, pageProps }): any => {
    return (
        <ThemeProvider attribute="class">
            <main className={inter.className}>
                <Component {...pageProps} />;
            </main>
        </ThemeProvider>
    );
};

export default MyApp;
