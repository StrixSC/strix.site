// pages/_app.js
import '@styles/globals.scss';
import '@styles/graph.scss';
import { ThemeProvider } from 'next-themes';
import { Inter } from '@next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';

const inter = Inter();

const MyApp = ({ Component, pageProps }): any => {
    return (
        <ThemeProvider attribute="class">
            <main className={inter.className}>
                <Component {...pageProps} />
            </main>
        </ThemeProvider>
    );
};

export default MyApp;
