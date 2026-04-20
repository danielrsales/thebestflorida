import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

const PERKS = [
  'Free profile listing',
  'Leads from local homeowners',
  'Free CRM via DunaHub',
]

export function FinalCTA() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          For Service Professionals
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Ready to grow your business
          <br className="hidden sm:block" /> in Florida?
        </h2>

        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join hundreds of service professionals on TheBestFlorida and connect with homeowners looking for your expertise.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {PERKS.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-blue-100">
              <CheckCircle className="w-4 h-4 text-green-300 shrink-0" />
              {p}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-green-900/30"
          >
            List Your Business
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/for-pros"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
          >
            Learn More
          </Link>
        </div>

        <p className="text-xs text-blue-200/60 mt-8">
          No credit card required · 100% free to list
        </p>
      </div>
    </section>
  )
}
