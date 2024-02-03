import d from '@public/data/links.json';
import Link from 'next/link';
import { CSSProperties } from 'react';

const LinksGrid = () => {
    const renderLinks = () => {
        const content = [];
        let data = d.sort((x, y) => x.order - y.order);
        for (let link of data) {
            const style = {
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(link.src)}")`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
            } as CSSProperties;
            content.push(
                <Link
                    key={link.name}
                    title={link.name}
                    style={style}
                    className="flex items-center transition-all opacity-80 hover:opacity-100 hover:z-10 justify-center hover:cursor-pointer w-[125px] h-[125px]"
                    href={link.url}>
                </Link>
            );
        }
        return content;
    };

    return (
        <div className="flex flex-wrap items-center justify-center lg:justify-start">
            {renderLinks()}
        </div>
    );
};

export default LinksGrid;
