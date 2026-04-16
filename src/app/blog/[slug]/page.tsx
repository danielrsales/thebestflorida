import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'
import { PostContent } from '@/components/blog/PostContent'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}/`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image ? { images: [{ url: post.image, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-700 to-blue-900 overflow-hidden">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/80 text-white px-2.5 py-1 rounded-full">
                {post.category.replace(/-/g, ' ')}
              </span>
            )}
            {post.city && (
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {post.city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <Link href="/blog/" className="flex items-center gap-1 hover:text-blue-600 transition-colors mr-auto">
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTime}
          </span>
          <span>By {post.author}</span>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-10">
        <PostContent post={post} />
      </article>

      {/* Footer CTA */}
      <div className="border-t bg-blue-50">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-700 mb-4">
            Looking for the best local services in Florida?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Find a Pro Near You
          </Link>
        </div>
      </div>
    </main>
  )
}
