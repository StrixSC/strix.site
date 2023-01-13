import { useRouter } from 'next/router';

const Logo = (props: any) => {
    const { src, ...customMeta } = props;
    return (
        <div className="flex justify-center items-center">
            <img className="rounded-full object-cover w-9 h-9" src={src}></img>
        </div>
    );
};

export default Logo;
