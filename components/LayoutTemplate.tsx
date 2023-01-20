import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Footer from '@components/Footer';
import Nav from '@components/Nav';
const LayoutTemplate = (props: any) => {
    const { children, ...customMeta } = props;
    const meta = {
        title: 'Home | Strix.Site',
        description: '',
        image: '',
        type: 'website',
        ...customMeta
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();
    return (
        <div
            id="layout-container"
            className="w-full h-full px-12 mx-auto my-12 text-lg lg:w-full xl:p-0 xl:w-9/12">
            <Head>
                <title key="title">{`${meta.title}`}</title>
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
                <Nav></Nav>
            </nav>
            <main className="my-24">{children}</main>
            <hr className="my-8"></hr>
            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default LayoutTemplate;
