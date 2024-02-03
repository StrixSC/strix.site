import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';

const NavItem = (props: any) => {
    // Taken from https://github.com/;leerob/leerob.io
    const router = useRouter();
    const { href, text, role, tabIndex } = props;
    const isActive = router.asPath === href;

    if (href) {
        return (
            <Link
                tabIndex={tabIndex}
                role={role}
                className={
                    'p-2 hover:ring-2 transition-all ' +
                    cn(isActive ? 'font-semibold ' : 'font-normal')
                }
                href={href}>
                {text}
            </Link>
        );
    } else {
        return (
            <div
                tabIndex={tabIndex}
                role={role}
                className={
                    'cursor-pointer p-2 hover:ring-2 transition-all ' +
                    cn(isActive ? 'font-semibold ' : 'font-normal')
                }>
                {text}
            </div>
        );
    }
};

export default NavItem;
