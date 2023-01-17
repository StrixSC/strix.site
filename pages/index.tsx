import About from '@components/About';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import LayoutTemplate from '../components/LayoutTemplate';
import BlogGrid from '@components/BlogGrid';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Projects from '@components/Projects';
import { ComponentProps } from 'react';
import ProjectsList from '@components/ProjectsList';
import LinksGrid from '@components/LinksGrid';

const IndexPage = (props?: ComponentProps<any>) => (
    <LayoutTemplate title="Home | Strix.Site">
        <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
        <div id="#blog">
            <div className="flex flex-col gap-4">
                <Title text="Blog"></Title>
                <Subtitle text="Recent blog posts"></Subtitle>
            </div>
            <div className="mt-8 rounded-md ">
                <BlogGrid featured={true} limit={3} col={3}></BlogGrid>
            </div>
            <div className="flex items-center justify-end pt-8">
                <Link
                    href="/blog"
                    className="flex items-center gap-4 p-2 transition-all rounded-md hover:cursor-pointer hover:ring-2 ">
                    <Subtitle text="See all posts"></Subtitle>
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-neutral-500"></FontAwesomeIcon>
                </Link>
            </div>
        </div>
        <div id="#projects">
            <div className="flex flex-col gap-4 mt-8">
                <Title text="Portfolio & Projects"></Title>
                <Subtitle className="lg:hidden" text="Featured projects"></Subtitle>
            </div>
            <div className="mt-12">
                <div>
                    <ProjectsList main={true} limit={3} cols={3}></ProjectsList>
                </div>
            </div>
            <div className="flex justify-end pt-8 itemscenter">
                <Link
                    href="/projects"
                    className="flex items-center gap-4 p-2 transition-all rounded-md hover:cursor-pointer hover:ring-2 ">
                    <Subtitle text="See all projects"></Subtitle>
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-neutral-500"></FontAwesomeIcon>
                </Link>
            </div>
        </div>
        <div id="#links">
            <div className="flex flex-col gap-4 mt-8">
                <Title text="Links"></Title>
                <Subtitle className="lg:hidden" text="Find me on..."></Subtitle>
            </div>
            <div className="mt-8">
                <LinksGrid></LinksGrid>
            </div>
        </div>
    </LayoutTemplate>
);

export default IndexPage;
