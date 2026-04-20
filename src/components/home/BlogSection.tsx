import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  category: string | null
  published_at: string | null
  created_at: string
}

interface BlogSectionProps {
  posts: BlogPost[]
}

function PostCard({ post }: { post: BlogPost }) {
  const date = post.published_at ?? post.created_at
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="relative h-44 bg-gradient-to-br from-blue-900/40 to-gray-800 overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={post.cover_image.includes('supabase')}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-20">📰</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        {post.category && (
          <span className="absolute top-3 left-3 text-xs font-semibold bg-blue-600 text-white px-2.5 py-0.5 rounded-full capitalize">
            {post.category.replace(/-/g, ' ')}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
            {post.excerpt.slice(0, 100)}{post.excerpt.length > 100 ? '…' : ''}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs text-blue-400 font-medium group-hover:text-blue-300 transition-colors flex items-center gap-0.5">
            Read <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function PlaceholderCard() {
  return (
    <div className="flex flex-col bg-gray-900 rounded-2xl border border-gray-800 border-dashed overflow-hidden items-center justify-center p-8 text-center min-h-[260px]">
      <span className="text-4xl mb-3 opacity-20">📰</span>
      <p className="text-sm font-medium text-gray-600">Articles coming soon</p>
    </div>
  )
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">From the Blog</p>
            <h2 className="text-3xl font-bold text-white mb-2">Florida Insights</h2>
            <p className="text-gray-400">Tips, guides, and local recommendations</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.length > 0
            ? posts.map((post) => <PostCard key={post.slug} post={post} />)
            : [0, 1, 2].map((i) => <PlaceholderCard key={i} />)
          }
        </div>
      </div>
    </section>
  )
}
