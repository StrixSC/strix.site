import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeCodeTitles from 'rehype-code-titles';
import remarkHighlight from 'rehype-highlight';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeCodeTitles, rehypeAutolinkHeadings, remarkHighlight],
        providerImportSource: '@mdx-js/react'
    }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    reactStrictMode: true,
    images: { domains: ['avatars.githubusercontent.com'] },
    rewrites: async () => [
        {
            source: '/public/graph.html',
            destination: '/pages/api/graph.js'
        }
    ]
};

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
