import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';

const NavItem = (props: any) => {
    // Taken from https://github.com/;leerob/leerob.io
    const router = useRouter();
    const { href, text } = props;
    const isActive = router.asPath === href;

    if (href) {
        return (
            <Link
                className={
                    'p-2 dark:bg-inherit hover:ring-2 transition-all ' +
                    cn(isActive ? 'font-semibold text-neutral-900 dark:text-white' : 'font-normal')
                }
                href={href}>
                {text}
            </Link>
        );
    } else {
        return (
            <div
                className={
                    'cursor-pointer p-2 dark:bg-inherit hover:ring-2 transition-all ' +
                    cn(isActive ? 'font-semibold text-neutral-900 dark:text-white' : 'font-normal')
                }>
                {text}
            </div>
        );
    }
};

export default NavItem;
