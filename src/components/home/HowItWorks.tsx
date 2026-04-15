import { Search, ClipboardList, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const STEPS = [
  {
    icon: Search,
    title: 'Search Your Service',
    description: 'Tell us what you need and where you are in Florida.',
  },
  {
    icon: ClipboardList,
    title: 'Get Free Quotes',
    description: 'We match you with top-rated local pros who respond fast.',
  },
  {
    icon: Star,
    title: 'Hire the Best',
    description: 'Compare reviews and prices, then hire with confidence.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">How It Works</h2>
        <p className="text-gray-500 text-center mb-12">Get connected with the best pros in 3 easy steps</p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {STEPS.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-1">Step {i + 1}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-10" asChild>
            <Link href="/quote">Get Free Quotes Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
