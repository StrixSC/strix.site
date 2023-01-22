import { useEffect, useState } from 'react';
import Logo from '@components/Logo';
import ThemeToggleButton from '@components/ThemeToggleButton';
import NavItem from '@components/NavItem';
import logo from '@public/assets/logo.svg';
import CVButton from './CVButton';

const Nav = (props: any) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    function toggleClass() {
        const menu = document.querySelector('.mobile-menu');
        menu.classList.toggle('hidden');
    }

    return (
        <main>
            <nav className="flex items-center justify-between">
                <Logo src={logo.src}></Logo>
                <div className="flex-wrap items-center hidden gap-8 md:flex ">
                    <ul className="flex flex-wrap items-center gap-4 list-none">
                        <li className="">
                            <NavItem text="Blog" href="/blog"></NavItem>
                        </li>
                        <li className="">
                            <NavItem text="Projects" href="/projects"></NavItem>
                        </li>
                        <li className="">
                            <CVButton></CVButton>
                        </li>
                    </ul>

                    {mounted && <ThemeToggleButton></ThemeToggleButton>}
                </div>
                <div className="flex items-center gap-4 md:hidden">
                    {mounted && <ThemeToggleButton></ThemeToggleButton>}
                    <button
                        className="outline-none mobile-menu-button"
                        onClick={() => toggleClass()}>
                        <svg
                            className="w-6 h-6 text-gray-500"
                            x-show="!showMenu"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            <div className="hidden mt-8 mobile-menu">
                <ul className="flex flex-col items-end gap-4 text-left list-none">
                    <li>
                        <NavItem text="Blog" href="/blog"></NavItem>
                    </li>
                    <li>
                        <NavItem text="Projects" href="/projects"></NavItem>
                    </li>
                    <li>
                        <CVButton></CVButton>
                    </li>
                </ul>
            </div>
        </main>
    );
};

export default Nav;
