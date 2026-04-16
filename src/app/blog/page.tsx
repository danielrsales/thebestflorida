import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Tips, guides, and local service reviews across Florida — from Miami to Jacksonville and everywhere in between.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'Blog | TheBestFlorida',
    description:
      'Tips, guides, and local service reviews across Florida.',
    url: '/blog/',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            TheBestFlorida Blog
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Local guides, tips, and service reviews from across the Sunshine State.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {posts.length === 0 && (
          <p className="text-center text-gray-400 py-20">No posts yet — check back soon.</p>
        )}

        {/* Featured */}
        {featured && (
          <div className="mb-10">
            <PostCard post={featured} featured />
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
