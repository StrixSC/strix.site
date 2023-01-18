import d from '@public/data/links.json';
import Link from 'next/link';
import SVG from 'react-inlinesvg';

const LinksGrid = (props: any) => {
    const renderLinks = () => {
        const content = [];
        let data = d.sort((x, y) => x.order - y.order);
        for (let link of data) {
            content.push(
                <Link
                    key={link.name}
                    title={link.name}
                    className="flex items-center transition-all hover:ring-2 justify-center hover:cursor-pointer w-[175px] h-[175px]"
                    href={link.url}>
                    <SVG src={link.src}></SVG>
                </Link>
            );
        }
        return content;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-0 lg:justify-start">
            {renderLinks()}
        </div>
    );
};

export default LinksGrid;
