import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Award, Link2, TrendingUp, Building2, Gift } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Service Professionals | TheBestFlorida',
  description:
    'Get featured in our Top 15 lists, earn a backlink to your website, and connect with Florida homeowners — completely free. No contracts, no fees.',
  alternates: { canonical: '/for-pros/' },
  openGraph: {
    title: 'For Service Professionals | TheBestFlorida',
    description: 'Get featured in our Top 15 lists and grow your Florida service business for free.',
    url: '/for-pros/',
  },
}

const STEPS = [
  {
    number: '01',
    title: 'Get Featured',
    description:
      "We research and handpick the best service companies in each Florida city. If you qualify, we'll reach out to invite you.",
  },
  {
    number: '02',
    title: 'Add Your Badge',
    description:
      'Place our Top 15 verified badge on your website. It builds trust with your customers and links back to your feature article.',
  },
  {
    number: '03',
    title: 'Get More Customers',
    description:
      'Your business appears in our Top 15 article with a direct link to your website. Homeowners find you through Google searches.',
  },
]

const BENEFITS = [
  { icon: Star,      label: 'Free exposure in Top 15 articles' },
  { icon: Link2,     label: 'SEO backlink to your website' },
  { icon: Award,     label: 'Verified Top 15 badge for your site' },
  { icon: TrendingUp, label: 'Increased trust & credibility' },
  { icon: Gift,      label: 'Free CRM via DunaHub partner' },
  { icon: Building2, label: 'No contracts, no fees — ever' },
]

const CATEGORIES = [
  'Roofing', 'Gutters', 'Pool Service', 'Landscaping', 'HVAC',
  'Plumbing', 'Electrical', 'Painting', 'Pressure Washing', 'Fencing',
]

export default function ForProsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            For Service Professionals
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Grow Your Business with TheBestFlorida
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Get featured in our Top 15 lists, earn backlinks to your website, and connect with
            homeowners looking for your services — completely free.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Three simple steps to start getting free exposure for your business.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="text-4xl font-extrabold text-blue-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Get ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            What You Get
          </h2>
          <p className="text-gray-500 text-center mb-14">
            Everything included, nothing to pay — now or ever.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 bg-gray-50"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800 leading-snug pt-1.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Feature ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">
            Who We Feature
          </h2>
          <p className="text-gray-600 leading-relaxed mb-10">
            We feature established service businesses in Florida with a strong reputation,
            active online presence, and great customer reviews.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get featured?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Join hundreds of Florida service professionals already growing with TheBestFlorida.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-blue-200/60 mt-6">
            No credit card required · 100% free
          </p>
        </div>
      </section>

    </main>
  )
}
