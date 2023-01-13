import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';

const NavItem = (props: any) => {
    // Taken from https://github.com/;leerob/leerob.io
    const router = useRouter();
    const { href, text } = props;
    const isActive = router.asPath === href;

    return (
        <Link className={cn(isActive ? 'font-semibold' : 'font-normal')} href={href}>
            {text}
        </Link>
    );
};

export default NavItem;
