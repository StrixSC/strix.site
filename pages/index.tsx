import About from '@components/About';
import Title from '@components/Title';
import Subtitle from '@components/Subtitle';
import LayoutTemplate from '../components/LayoutTemplate';

const IndexPage = () => {
    return (
        <LayoutTemplate title="Home | Strix.Site">
            <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
            <div className="flex flex-col gap-4">
                <Title text="Blog"></Title>
                <Subtitle text="Recent blog posts"></Subtitle>
            </div>
        </LayoutTemplate>
    );
};

export default IndexPage;
