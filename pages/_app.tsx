// pages/_app.js
import '@styles/globals.scss';
import { ThemeProvider } from 'next-themes';
import { Inter } from '@next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';

const inter = Inter({ subsets: ['latin'] });

import { GoogleAnalytics } from 'nextjs-google-analytics';

const MyApp = ({ Component, pageProps }): any => {
    return (
        <>
            <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
            <ThemeProvider attribute="class">
                <main className={inter.className}>
                    <Component {...pageProps} />
                </main>
            </ThemeProvider>
        </>
    );
};

export default MyApp;
