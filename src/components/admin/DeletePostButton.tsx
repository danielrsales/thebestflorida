'use client'

import { Trash2 } from 'lucide-react'

export function DeletePostButton({ slug, title }: { slug: string; title: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
        const res = await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
        if (res.ok) window.location.reload()
        else alert('Failed to delete post.')
      }}
      className="text-gray-500 hover:text-red-400 transition-colors"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
