import About from '@components/About';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import LayoutTemplate from '../components/LayoutTemplate';
import BlogGrid from '@components/BlogGrid';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const IndexPage = () => {
    return (
        <LayoutTemplate title="Home | Strix.Site">
            <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
            <div id="#blog">
                <div className="flex flex-col gap-4">
                    <Title text="Blog"></Title>
                    <Subtitle text="Recent blog posts"></Subtitle>
                </div>
                <div className="mt-8 rounded-md bg-neutral-300 dark:bg-inherit dark:border-neutral-900 border-transparent border-2 p-4">
                    <BlogGrid limit={5}></BlogGrid>
                </div>
                <div className="flex justify-end items-center pt-8">
                    <div className="flex items-center gap-4 p-2 rounded-md hover:cursor-pointer hover:bg-neutral-400 hover:dark:bg-neutral-900 transition-all">
                        <Subtitle text="See all posts"></Subtitle>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-neutral-500"></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </LayoutTemplate>
    );
};

export default IndexPage;
