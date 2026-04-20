import Link from 'next/link'
import {
  Leaf, Waves, Wind, Wrench, Home, Sparkles, Zap, Paintbrush2,
} from 'lucide-react'

const CATEGORIES = [
  { name: 'Landscaping',    slug: 'landscaping',    Icon: Leaf,        color: 'text-green-400',  bg: 'bg-green-400/10 group-hover:bg-green-400/20' },
  { name: 'Pool Cleaning',  slug: 'pool-cleaning',  Icon: Waves,       color: 'text-cyan-400',   bg: 'bg-cyan-400/10 group-hover:bg-cyan-400/20' },
  { name: 'HVAC',           slug: 'hvac',           Icon: Wind,        color: 'text-blue-400',   bg: 'bg-blue-400/10 group-hover:bg-blue-400/20' },
  { name: 'Plumbing',       slug: 'plumbing',       Icon: Wrench,      color: 'text-orange-400', bg: 'bg-orange-400/10 group-hover:bg-orange-400/20' },
  { name: 'Roofing',        slug: 'roofing',        Icon: Home,        color: 'text-red-400',    bg: 'bg-red-400/10 group-hover:bg-red-400/20' },
  { name: 'House Cleaning', slug: 'house-cleaning', Icon: Sparkles,    color: 'text-purple-400', bg: 'bg-purple-400/10 group-hover:bg-purple-400/20' },
  { name: 'Electrical',     slug: 'electrical',     Icon: Zap,         color: 'text-yellow-400', bg: 'bg-yellow-400/10 group-hover:bg-yellow-400/20' },
  { name: 'Painting',       slug: 'painting',       Icon: Paintbrush2, color: 'text-pink-400',   bg: 'bg-pink-400/10 group-hover:bg-pink-400/20' },
]

export function PopularCategories() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Popular Services</h2>
          <p className="text-gray-400 text-lg">Find top-rated professionals for every home need</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map(({ name, slug, Icon, color, bg }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-800 p-6 transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:-translate-y-0.5 bg-gray-900"
            >
              <div className={`p-3 rounded-xl transition-colors ${bg}`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Browse all 35+ services →
          </Link>
        </div>
      </div>
    </section>
  )
}
