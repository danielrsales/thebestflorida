import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Tag } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'

interface PostCardProps {
  post: PostMeta
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const href = `/blog/${post.slug}/`

  if (featured) {
    return (
      <article className="group relative bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-2/5 h-52 md:h-auto bg-gradient-to-br from-blue-600 to-blue-800 flex-shrink-0">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-blue-200 text-5xl font-bold opacity-20 select-none">
              TBF
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-center flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {post.category.replace(/-/g, ' ')}
              </span>
            )}
            {post.city && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {post.city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
            <Link href={href} className="before:absolute before:inset-0">
              {post.title}
            </Link>
          </h2>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-blue-600 to-blue-800 flex-shrink-0 overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-blue-200 text-4xl font-bold opacity-20 select-none">
            TBF
          </div>
        )}
        {post.category && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              {post.category.replace(/-/g, ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
          <Link href={href} className="before:absolute before:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{post.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </article>
  )
}
