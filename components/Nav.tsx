import { useEffect, useState } from 'react';
import Logo from '@components/Logo';
import ThemeToggleButton from '@components/ThemeToggleButton';
import NavItem from '@components/NavItem';

const Nav = (props: any) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <nav className="hidden lg:flex justify-between items-center">
            <Logo src="https://avatars.githubusercontent.com/u/29717413?v=4"></Logo>
            <div className="flex flex-wrap gap-8 items-center">
                <ul className="list-none flex flex-wrap gap-4 items-center">
                    <li className="">
                        <NavItem text="Home" href="/"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Blog" href="/blog"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Links" href="/links"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Projects" href="/projects"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Sketches" href="/sketches"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Resume" href="/resume"></NavItem>
                    </li>
                </ul>
                {mounted && <ThemeToggleButton></ThemeToggleButton>}
            </div>
        </nav>
    );
};

export default Nav;
