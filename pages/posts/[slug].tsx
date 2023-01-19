import LayoutTemplate from '@components/LayoutTemplate';
import { MDXProvider } from '@mdx-js/react';
import { mdxToHtml } from '@lib/mdx';
import { MDXRemote } from 'next-mdx-remote';
import posts from '@public/data/blog-posts.json';
import { getPageBySlug } from '@lib/pages';

const Post = (props: any) => {
    console.log(props);
    return (
        <LayoutTemplate title={`${props.meta.title}`}>
            <div id="#post" className="mt-24">
                <article className="prose dark:prose-invert">
                    <MDXRemote {...props.content}></MDXRemote>
                </article>
            </div>
        </LayoutTemplate>
    );
};

export async function getStaticProps({ params }) {
    const { slug } = params;
    const post = getPageBySlug(slug);
    const content = await mdxToHtml(post.content || '');

    if (!content) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            ...post,
            content
        }
    };
}

export async function getStaticPaths() {
    return {
        paths: posts.map((post) => {
            return {
                params: {
                    slug: post.slug
                }
            };
        }),
        fallback: false
    };
}

export default Post;
