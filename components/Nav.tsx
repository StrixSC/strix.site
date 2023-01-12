import { useRouter } from 'next/router';
import Link from 'next/link';

const Nav = (props: any) => {
    const { children, ...customMeta } = props;
    const router = useRouter();

    return <div>This is the regular nav</div>;
};

export default Nav;
