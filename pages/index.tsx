import About from '@components/About';
import LayoutTemplate from '../components/LayoutTemplate';

const IndexPage = () => {
    return (
        <LayoutTemplate title="Home | Strix.Site">
            <About profileImage="https://avatars.githubusercontent.com/u/29717413?v=4"></About>
        </LayoutTemplate>
    );
};

export default IndexPage;
