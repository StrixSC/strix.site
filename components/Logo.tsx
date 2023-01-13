import { useRouter } from 'next/router';
import Link from 'next/link';

const Logo = (props: any) => {
    const { children, ...customMeta } = props;
    const router = useRouter();

    return <div>Logo</div>;
};

export default Logo;
