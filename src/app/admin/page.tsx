import Link from 'next/link'
import { FileText, PlusCircle } from 'lucide-react'

export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <Link
          href="/admin/blog"
          className="flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-5 transition-colors group"
        >
          <FileText className="w-6 h-6 text-blue-400" />
          <div>
            <p className="font-semibold text-gray-100">Blog Posts</p>
            <p className="text-xs text-gray-400">Manage all posts</p>
          </div>
        </Link>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-5 transition-colors group"
        >
          <PlusCircle className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-semibold text-gray-100">New Post</p>
            <p className="text-xs text-gray-400">Write a new article</p>
          </div>
        </Link>
      </div>
    </main>
  )
}
