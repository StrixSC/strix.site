import { useEffect, useState } from 'react';
import Logo from '@components/Logo';
import ThemeToggleButton from '@components/ThemeToggleButton';
import NavItem from '@components/NavItem';
import logo from '@public/assets/logo.svg';

const Nav = (props: any) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <nav className="items-center justify-between hidden lg:flex">
            <Logo src={logo.src}></Logo>
            <div className="flex flex-wrap items-center gap-8">
                <ul className="flex flex-wrap items-center gap-4 list-none">
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
                    {/* <li className="">
                        <NavItem text="Sketches" href="/sketches"></NavItem>
                    </li> */}
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
