import { useRouter } from 'next/router';
import Link from 'next/link';

const MobileNav = (props: any) => {
    const { children, ...customMeta } = props;
    const router = useRouter();

    return <div className="lg:hidden">This is the mobile nav</div>;
};

export default MobileNav;
