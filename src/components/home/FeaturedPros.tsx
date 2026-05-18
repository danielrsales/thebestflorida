import Link from 'next/link'
import { Search, SlidersHorizontal, MessageSquare } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    title: 'Search',
    description: 'Browse by service category and city to find pros in your area.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Compare',
    description: 'Read verified profiles, check certifications, and see real reviews.',
  },
  {
    icon: MessageSquare,
    title: 'Connect',
    description: "Request a quote directly. It's free and takes less than a minute.",
  },
]

export function FeaturedPros(_: { pros: unknown[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-2">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Find the Right Pro in 3 Steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-sm"
          >
            Find a Pro Near You →
          </Link>
        </div>
      </div>
    </section>
  )
}
