import Link from 'next/link';
import LayoutTemplate from '../components/LayoutTEmplate';

const IndexPage = () => (
    <LayoutTemplate title="Home | Next.js + TypeScript Example">
        <h1>Hello Next.js 👋</h1>
        <p className="text-3xl font-bold underline">
            <Link href="/about">About</Link>
        </p>
    </LayoutTemplate>
);

export default IndexPage;
