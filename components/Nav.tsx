import { useRouter } from 'next/router';
import Logo from './Logo';
import ModeToggleButton from './ModeToggleButton';
import NavItem from './NavItem';

const Nav = (props: any) => {
    const router = useRouter();
    return (
        <nav className="flex justify-between">
            <Logo></Logo>
            <div className="flex flex-wrap gap-8">
                <ul className="list-none flex flex-wrap gap-4">
                    <li className="">
                        <NavItem text="Home" href="/"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Blog" href="/blog/"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Links" href="/links/"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Projects" href="/projects/"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Sketches" href="/sketches/"></NavItem>
                    </li>
                    <li className="">
                        <NavItem text="Resume" href="/resume/"></NavItem>
                    </li>
                </ul>
                <ModeToggleButton></ModeToggleButton>
            </div>
        </nav>
    );
};

export default Nav;
