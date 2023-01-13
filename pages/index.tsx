import About from '@components/About';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import LayoutTemplate from '../components/LayoutTemplate';
import BlogGrid from '@components/BlogGrid';

const IndexPage = () => {
    return (
        <LayoutTemplate title="Home | Strix.Site">
            <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
            <div id="#blog">
                <div className="flex flex-col gap-4">
                    <Title text="Blog"></Title>
                    <Subtitle text="Recent blog posts"></Subtitle>
                </div>
                <div className="mt-8">
                    <BlogGrid limit={3}></BlogGrid>
                </div>
            </div>
        </LayoutTemplate>
    );
};

export default IndexPage;
