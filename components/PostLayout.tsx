import { MDXProvider } from '@mdx-js/react';
import LayoutTemplate from '@components/LayoutTemplate';

const PostLayout = ({ meta, children }) => {
    return (
        <LayoutTemplate title={meta.title}>
            <MDXProvider>
                <div className="flex justify-center gap-2 mt-24">
                    <article className="w-full prose lg:prose-xl ">
                        {children}
                    </article>
                </div>
            </MDXProvider>
        </LayoutTemplate>
    );
};

export default PostLayout;
