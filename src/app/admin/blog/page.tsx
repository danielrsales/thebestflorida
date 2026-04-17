import Link from 'next/link'
import { PlusCircle, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react'
import { adminGetAllPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await adminGetAllPosts()
  const published = posts.filter((p) => p.published)
  const drafts = posts.filter((p) => !p.published)

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Blog Posts</h1>
          <p className="text-sm text-gray-400 mt-1">
            {published.length} published · {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <p className="text-gray-400">No posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-100 truncate max-w-[280px]">{post.title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[280px] mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-gray-400 text-xs">{post.category ?? '—'}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-gray-400 text-xs">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-700 text-gray-400 border border-gray-600 px-2 py-0.5 rounded-full">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-gray-500 hover:text-blue-400 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${post.slug}/edit`}
                        className="text-gray-500 hover:text-yellow-400 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteButton slug={post.slug} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

// Inline client component for delete
function DeleteButton({ slug, title }: { slug: string; title: string }) {
  'use client'
  return (
    <form
      action={`/api/admin/blog/${slug}`}
      method="DELETE"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
        const res = await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
        if (res.ok) window.location.reload()
        else alert('Failed to delete post.')
      }}
    >
      <button type="submit" className="text-gray-500 hover:text-red-400 transition-colors" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  )
}
