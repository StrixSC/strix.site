import BlogGrid from '@components/BlogGrid';
import LayoutTemplate from '@components/LayoutTemplate';
const BlogPage = () => {
    return (
        <LayoutTemplate title="Blog | Strix.Site">
            <BlogGrid col={4}></BlogGrid>
        </LayoutTemplate>
    );
};
export default BlogPage;
