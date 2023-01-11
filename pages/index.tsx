import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p className="text-3xl font-bold underline">
      <Link href="/about">About</Link>
    </p>
  </Layout>
)

export default IndexPage
