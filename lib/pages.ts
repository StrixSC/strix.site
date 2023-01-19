import { join } from 'path';
import { readFileSync } from 'fs';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), 'pages/_posts');

export function getPageBySlug(slug: string) {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = join(postsDirectory, `${realSlug}.mdx`);
    const fileContents = readFileSync(fullPath, 'utf8');
    const { data: meta, content } = matter(fileContents);

    return { slug: realSlug, meta, content };
}
