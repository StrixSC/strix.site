import articles from '@lib/example-blogposts.json';
import Link from 'next/link';
const BlogGrid = (props: any) => {
    let { limit } = props;
    const renderArticles = () => {
        if (limit > articles.length) {
            limit = articles.length;
        }
        const content = [];
        for (let i = 0; limit ? i <= limit : i < articles.length; i++) {
            const style = {
                backgroundImage: "url('" + articles[i].image + "')"
            };
            content.push(
                <Link
                    key={i}
                    href={articles[i].slug}
                    className={
                        'block w-[288px] h-[288px] align-middle max-w-full object-cover bg-no-repeat bg-cover ' +
                        articles[i].sizing
                    }
                    style={style}
                    id={articles[i].title}>
                    {articles[i].title}
                </Link>
            );
        }
        return content;
    };

    return (
        <div id="blog-layout" className="grid gap-2 grid-cols-3 grid-flow-dense auto-rows-fr">
            {renderArticles()}
        </div>
    );
};

export default BlogGrid;
