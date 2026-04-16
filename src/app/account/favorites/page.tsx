'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Favorites</h1>
        <p className="text-sm text-gray-500 mt-1">Pros you&apos;ve saved for later.</p>
      </div>

      <div className="bg-white rounded-xl border p-10 text-center">
        <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No favorites yet.</p>
        <p className="text-xs text-gray-400 mt-1 mb-4">
          Save pros to your favorites while browsing.
        </p>
        <Link
          href="/"
          className="inline-flex text-sm bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Pros
        </Link>
      </div>
    </div>
  )
}
