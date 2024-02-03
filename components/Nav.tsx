import { useEffect, useState } from 'react';
import Link from "next/link";
import Logo from '@components/Logo';
import logo from '@public/assets/logo.svg';
import ThemePicker from './ThemePicker';

const Nav = (props: any) => {
    return (
        <>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <Logo src={logo.src}></Logo>
                </div>
                <div className="navbar-end">
                    <div className='dropdown dropdown-end'>
                        <label
                            tabIndex={0}
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <svg
                                width="20"
                                height="20"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-5 h-5 stroke-current md:h-6 md:w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                ></path>
                            </svg>
                        </label>
                        <ThemePicker></ThemePicker>
                    </div>
                    <div className="dropdown dropdown-end">

                        <label
                            tabIndex={2}
                            className="btn btn-ghost btn-circle"
                        >
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 1H0M16 7H0M16 13H9" stroke="currentColor" strokeWidth="2" />
                            </svg>

                        </label>
                        <ul
                            tabIndex={2}
                            className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/projects">Projects</Link>
                            </li>
                            <li>
                                <Link href="/blog">Blog</Link>
                            </li>
                            <li>
                                <Link target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1SobHiTwJjF-FCJpIgA7Z7vfiRcJK032R/view?usp=share_link">CV English</Link>
                            </li>
                            <li>
                                <Link target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1T-yIUZ2VBmnIAI5G-kIAZJ5Lv39_VRcw/view?usp=share_link">CV Français</Link>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;
