import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';

const NavItem = (props: any) => {
    // Taken from https://github.com/;leerob/leerob.io
    const router = useRouter();
    const { href, text } = props;
    const isActive = router.asPath === href;

    return (
        <Link
            className={
                'p-2 dark:bg-inherit rounded-lg hover:ring-2 transition-all ' +
                cn(isActive ? 'font-semibold text-neutral-900 dark:text-white' : 'font-normal')
            }
            href={href}>
            {text}
        </Link>
    );
};

export default NavItem;
