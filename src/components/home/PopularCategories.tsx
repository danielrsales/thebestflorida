import Link from 'next/link'
import {
  Leaf, Waves, Wind, Wrench, Home, Sparkles, Zap, Paintbrush2,
} from 'lucide-react'

const CATEGORIES = [
  { name: 'Landscaping',    slug: 'landscaping',    Icon: Leaf,        color: 'text-green-600',  bg: 'bg-green-50 group-hover:bg-green-100',  border: 'border-green-100' },
  { name: 'Pool Cleaning',  slug: 'pool-cleaning',  Icon: Waves,       color: 'text-cyan-600',   bg: 'bg-cyan-50 group-hover:bg-cyan-100',    border: 'border-cyan-100' },
  { name: 'HVAC',           slug: 'hvac',           Icon: Wind,        color: 'text-blue-600',   bg: 'bg-blue-50 group-hover:bg-blue-100',    border: 'border-blue-100' },
  { name: 'Plumbing',       slug: 'plumbing',       Icon: Wrench,      color: 'text-orange-600', bg: 'bg-orange-50 group-hover:bg-orange-100',border: 'border-orange-100' },
  { name: 'Roofing',        slug: 'roofing',        Icon: Home,        color: 'text-red-600',    bg: 'bg-red-50 group-hover:bg-red-100',      border: 'border-red-100' },
  { name: 'House Cleaning', slug: 'house-cleaning', Icon: Sparkles,    color: 'text-purple-600', bg: 'bg-purple-50 group-hover:bg-purple-100',border: 'border-purple-100' },
  { name: 'Electrical',     slug: 'electrical',     Icon: Zap,         color: 'text-yellow-600', bg: 'bg-yellow-50 group-hover:bg-yellow-100',border: 'border-yellow-100' },
  { name: 'Painting',       slug: 'painting',       Icon: Paintbrush2, color: 'text-pink-600',   bg: 'bg-pink-50 group-hover:bg-pink-100',    border: 'border-pink-100' },
]

export function PopularCategories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Home Services</h2>
          <p className="text-gray-500 text-lg">What are you looking for today?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map(({ name, slug, Icon, color, bg, border }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className={`group flex flex-col items-center gap-3 rounded-2xl border ${border} p-6 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className={`p-3 rounded-xl transition-colors ${bg}`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Browse all 35+ services →
          </Link>
        </div>
      </div>
    </section>
  )
}
