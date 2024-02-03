import Link from 'next/link';

const Logo = (props: any) => {
    const { src, ...customMeta } = props;
    return (
        <div className="flex items-center justify-center">
            <Link href="/">
                <img
                    className=" hover:drop-shadow-sm w-[50px] h-[50px]"
                    src={src}></img>
            </Link>
        </div>
    );
};

export default Logo;
