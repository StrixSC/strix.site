const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: []
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
module.exports = withMDX(nextConfig);
