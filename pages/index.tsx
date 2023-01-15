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

const IndexPage = (props?: ComponentProps<any>) => {
    return (
        <LayoutTemplate title="Home | Strix.Site">
            <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
            <div id="#blog">
                <div className="flex flex-col gap-4">
                    <Title text="Blog"></Title>
                    <Subtitle text="Recent blog posts"></Subtitle>
                </div>
                <div className="p-4 mt-8 border-2 rounded-md border-neutral-300 dark:bg-inherit dark:border-neutral-900">
                    <BlogGrid limit={5} col={3}></BlogGrid>
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
                    <Subtitle text=""></Subtitle>
                </div>
                <div className="mt-12">
                    <Projects></Projects>
                </div>
            </div>
        </LayoutTemplate>
    );
};

export default IndexPage;
