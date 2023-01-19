import BlogGrid from '@components/BlogGrid';
import LayoutTemplate from '@components/LayoutTemplate';
import Title from '@components/Title';
const BlogPage = () => {
    return (
        <LayoutTemplate title="Blog | Strix.Site">
            <div className="flex flex-col gap-8 wrap">
                <div>
                    <Title text="Blog"></Title>
                </div>
                <div className="">
                    <BlogGrid col={4}></BlogGrid>
                </div>
            </div>
        </LayoutTemplate>
    );
};
export default BlogPage;
