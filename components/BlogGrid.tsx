import articles from '@lib/example-blogposts.json';
import Link from 'next/link';
import truncate from '@utils/truncate';

const BlogGrid = (props: any) => {
    let { limit } = props;
    const renderArticles = () => {
        if (limit > articles.length) {
            limit = articles.length;
        }
        const content = [];
        const classAddons: Record<string, string> = {
            standard: '',
            wide: 'col-span-2',
            'very-wide': 'col-span-3',
            tall: 'row-span-2',
            'very-tall': 'row-span-3',
            square: 'col-span-2 row-span-2',
            full: 'col-span-3 row-span-3'
        };

        const textPositions: Record<string, string> = {
            br: 'items-end justify-end',
            tr: 'items-start justify-end',
            bl: 'items-end justify-start',
            tl: 'items-start justify-start',
            m: 'items-center justify-center'
        };

        for (let i = 0; limit ? i < limit : i < articles.length; i++) {
            const style = {
                backgroundImage: "url('" + articles[i].image + "')"
            };
            content.push(
                <Link
                    key={i}
                    href={articles[i].slug}
                    className={`w-full min-h-[288px] bg-cover xl:min-w-[288px] ${
                        classAddons[articles[i].sizing]
                    } hover:scale-[1.01] transition-all hover:drop-shadow-lg hover:opacity-95 `}
                    style={style}
                    id={articles[i].title}>
                    <div
                        className={`flex w-full h-full ${
                            articles[i].textpos ? textPositions[articles[i].textpos] : ''
                        }`}>
                        <div className="flex flex-col gap-2">
                            <div style={articles[i].styling} className="text-2xl">
                                {articles[i].title.length >= articles[i].truncate ? (
                                    <>
                                        {' '}
                                        {truncate(articles[i].title, articles[i].truncate)}&hellip;
                                    </>
                                ) : (
                                    articles[i].title
                                )}
                            </div>
                            <p className="block" style={articles[i].ststyling}>
                                {' '}
                                {articles[i].subtitle}
                            </p>
                        </div>
                    </div>
                </Link>
            );
        }
        return content;
    };

    return (
        <div
            id="blog-layout"
            className="
                flex flex-col auto-rows-auto md:grid md:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-4
            ">
            {renderArticles()}
        </div>
    );
};

export default BlogGrid;
