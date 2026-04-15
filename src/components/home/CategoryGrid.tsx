import Link from 'next/link'

const CATEGORIES = [
  { name: 'Landscaping', slug: 'landscaping', emoji: '🌿' },
  { name: 'House Cleaning', slug: 'house-cleaning', emoji: '🧹' },
  { name: 'Pool Cleaning', slug: 'pool-cleaning', emoji: '🏊' },
  { name: 'HVAC', slug: 'hvac', emoji: '❄️' },
  { name: 'Plumbing', slug: 'plumbing', emoji: '🔧' },
  { name: 'Electrical', slug: 'electrical', emoji: '⚡' },
  { name: 'Roofing', slug: 'roofing', emoji: '🏠' },
  { name: 'Painting', slug: 'painting', emoji: '🎨' },
  { name: 'Pest Control', slug: 'pest-control', emoji: '🐛' },
  { name: 'Moving', slug: 'moving', emoji: '📦' },
  { name: 'Tree Service', slug: 'tree-service', emoji: '🌳' },
  { name: 'Pressure Washing', slug: 'pressure-washing', emoji: '💧' },
]

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Browse by Service</h2>
        <p className="text-gray-500 text-center mb-10">Top-rated professionals for every home need</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border hover:border-blue-300 hover:shadow-md transition group"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/quote" className="text-blue-600 hover:underline text-sm font-medium">
            View all 35+ services →
          </Link>
        </div>
      </div>
    </section>
  )
}
