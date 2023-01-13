import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import MobileNav from './MobileNav';
import Nav from './Nav';

const LayoutTemplate = (props: any) => {
    const { children, ...customMeta } = props;
    const meta = {
        title: 'Default Title: Change Me',
        description: 'Default Description: Change Me',
        image: '#',
        type: 'website',
        ...customMeta
    };
    console.log(meta);
    const [isDark, setDark] = useState();
    const router = useRouter();
    return (
        <div className={isDark ? 'dark' : ''}>
            <Head>
                <title>{meta.title} </title>
                <meta name="robots" content="follow, index" />
                <meta content={meta.description} name="description" />
                <meta property="og:url" content={`https://strix.site${router.asPath}`} />
                <link rel="canonical" href={`https://strix.site${router.asPath}`} />
                <meta property="og:type" content={meta.type} />
                <meta property="og:site_name" content="Nawras M. Amin" />
                <meta property="og:description" content={meta.description} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:image" content={meta.image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@S7RIX" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image} />
                {meta.date && <meta property="article:published_time" content={meta.date} />}
            </Head>
            <nav>
                <MobileNav></MobileNav>
                <Nav></Nav>
            </nav>
            <main>{children}</main>
        </div>
    );
};

export default LayoutTemplate;
