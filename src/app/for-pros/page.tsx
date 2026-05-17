import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  UserPlus,
  Bell,
  Handshake,
  LayoutDashboard,
  Star,
  Award,
  Zap,
  Ban,
  Users,
  TrendingUp,
  MapPin,
  Search,
  ShieldCheck,
  BadgeCheck,
  Globe,
  Trophy,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Service Professionals | TheBestFlorida',
  description:
    'List your Florida home services business on TheBestFlorida. Get free leads from local homeowners, earn a verified badge, and grow with a free CRM. No contracts, no fees.',
  keywords: ['Florida contractors', 'home services Florida', 'list business Florida', 'contractor leads Florida'],
  alternates: { canonical: '/for-pros/' },
  openGraph: {
    title: 'For Service Professionals | TheBestFlorida',
    description:
      'Get free leads from Florida homeowners. Verified badge. Free CRM. No contracts, no fees.',
    url: '/for-pros/',
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { value: '23.5M+', label: 'Floridians' },
  { value: '8.6M', label: 'Homeowners' },
  { value: '$211B+', label: 'US Home Services Market' },
  { value: '91%', label: 'Read Reviews Before Hiring' },
]

const OPPORTUNITY_CARDS = [
  {
    number: '838 NEW',
    label: 'New residents arrive in Florida every single day',
    source: 'Florida Realtors, 2026',
  },
  {
    number: '$211B',
    label: 'U.S. home services market — projected to reach $893B by 2032',
    source: 'Verified Market Research',
  },
  {
    number: '$12B',
    label: 'Florida leads U.S. HVAC services in annual revenue',
    source: 'Industry Report 2026',
  },
]

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description:
      'Sign up and tell us about your business — services you offer, cities you cover, and your experience. Takes less than 5 minutes.',
  },
  {
    icon: Bell,
    title: 'We Send You Leads',
    description:
      "When homeowners in your area request quotes for your services, we send the lead directly to you. You'll get notified instantly.",
  },
  {
    icon: Handshake,
    title: 'Close the Deal',
    description:
      'Contact the homeowner, provide your quote, and win the job. Manage everything through your free DunaHub CRM dashboard.',
  },
]

const REPUTATION_STATS = [
  { pct: '91%', label: 'of homeowners read online reviews before hiring a contractor' },
  { pct: '68%', label: 'of U.S. homeowners used a home service app in 2023' },
  { pct: '75%', label: 'of consumers leverage online platforms to book or research services' },
  { pct: '42%', label: 'of consumers prefer booking home services online' },
]

const BENEFITS = [
  {
    icon: Bell,
    title: 'Free leads from local homeowners',
    description:
      'Homeowners searching for services in your area find you on TheBestFlorida and request quotes directly.',
  },
  {
    icon: LayoutDashboard,
    title: 'Free CRM to manage your business',
    description:
      'Every contractor gets free access to DunaHub — a complete CRM with pipeline, inbox, scheduling, and invoicing.',
  },
  {
    icon: Star,
    title: 'Featured in Top 15 articles',
    description:
      "Top-performing contractors get featured in our 'Top 15 Best [Service] in [City]' articles, boosting your online visibility.",
  },
  {
    icon: Award,
    title: 'Verified badge for your website',
    description:
      "Stand out from competitors with our 'Top 15 Verified' badge on your website.",
  },
  {
    icon: Ban,
    title: 'No contracts, no fees',
    description:
      'Listing your business and receiving direct leads is 100% free. No hidden costs, no commitments.',
  },
  {
    icon: Zap,
    title: 'SMS & email notifications',
    description:
      'Get notified instantly when a new lead comes in. Never miss an opportunity.',
  },
]

const CERTIFY_COLS = [
  {
    icon: Search,
    title: 'We Research',
    description:
      'We independently research and verify every contractor on our platform. Licenses, insurance, customer reviews, and online reputation — all checked.',
  },
  {
    icon: ShieldCheck,
    title: 'We Verify',
    description:
      'Only contractors who maintain high customer satisfaction ratings, valid licensing, and positive reviews qualify to be featured in our Top 15 lists.',
  },
  {
    icon: BadgeCheck,
    title: 'We Endorse',
    description:
      "Certified contractors receive the 'TheBestFlorida Verified' badge — a trust signal that converts skeptical homeowners into paying customers.",
  },
]

const BUSINESS_BENEFITS = [
  {
    icon: Users,
    title: 'More Qualified Leads',
    description:
      "Homeowners who find you on TheBestFlorida already trust the platform. They're not price-shopping — they're ready to hire.",
  },
  {
    icon: TrendingUp,
    title: 'Higher Conversion Rates',
    description:
      'Our verified badge signals trust at a glance. Studies show trust badges can increase conversion rates by up to 42%.',
  },
  {
    icon: Globe,
    title: 'Better SEO Visibility',
    description:
      "Featured listings in 'Top 15 Best [Service] in [City]' articles boost your visibility on Google when homeowners search.",
  },
  {
    icon: Trophy,
    title: 'Competitive Edge',
    description:
      'In a market with 33,000+ home builders and tens of thousands of service contractors, certification is what separates you from the crowd.',
  },
]

const REQUIREMENTS = [
  'Active business with good reputation',
  'Serving customers in Florida',
  'Licensed and insured (where applicable)',
  'Positive customer reviews',
]

const CRM_FEATURES = [
  'Visual sales pipeline',
  'Unified inbox (WhatsApp, SMS, Email)',
  'Job scheduling & calendar',
  'Quotes & invoicing',
  'Mobile-friendly',
]

const MARKET_STATS = [
  { value: '23.55M', label: 'Total Florida population in 2026', source: 'U.S. Census Bureau' },
  { value: '8.6M', label: 'Florida homeowners', source: 'U.S. Census Bureau' },
  { value: '40%', label: 'U.S. homes over 50 years old — driving repair demand', source: 'Industry Report 2026' },
  { value: '$417,100', label: 'Florida median home price (March 2026)', source: 'Florida Realtors' },
  { value: '305,953', label: 'New residents Florida adds per year (2026–2030)', source: 'Florida Realtors, 2026' },
  { value: '5.2% CAGR', label: 'U.S. home services industry growth rate', source: 'Verified Market Research' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ForProsPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            For Service Professionals
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Get More Customers in Florida
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            TheBestFlorida connects you with homeowners actively looking for your services.
            Get leads delivered straight to your inbox — for free.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-blue-200/60 mt-5">
            No credit card required · 100% free to join
          </p>

          {/* Trust bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-10">
            {TRUST_STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{value}</div>
                <div className="text-xs text-blue-200/70 mt-1 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Florida Opportunity ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Market Context</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            The Florida Opportunity
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-2xl mx-auto">
            Florida is one of the fastest-growing markets in the U.S. for home service businesses.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {OPPORTUNITY_CARDS.map(({ number, label, source }) => (
              <div
                key={number}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-500 mb-3">
                  {number}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{label}</p>
                <p className="text-xs text-gray-400">{source}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            With over 300,000 new residents every year and 8.6 million homeowners statewide,
            the demand for trusted home service professionals has never been stronger. From
            hurricane-related roof repairs to year-round pool maintenance, Florida homeowners
            are actively searching for reliable contractors — every day.
          </p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Start receiving leads in 3 simple steps.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Online Reputation Matters ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            Why Online Reputation Matters in Florida
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Modern homeowners don&apos;t pick up the phone book. They Google.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {REPUTATION_STATS.map(({ pct, label }) => (
              <div
                key={pct}
                className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-extrabold text-blue-600 mb-3">{pct}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto text-center">
            <p className="text-gray-700 leading-relaxed">
              The problem? Online reviews are easy to manipulate. Star ratings can be bought.
              Homeowners are getting smarter — and they&apos;re looking for trusted, independent
              verification. <strong>That&apos;s where TheBestFlorida comes in.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── What You Get ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            What You Get
          </h2>
          <p className="text-gray-500 text-center mb-14">
            Everything included, nothing to pay — now or ever.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-gray-100 bg-white flex flex-col gap-3 shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── We Don't Just List — We Certify ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            We Don&apos;t Just List Businesses — We Certify Them
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-xl mx-auto">
            Stand out from thousands of contractors with the TheBestFlorida verified badge.
          </p>

          <p className="text-gray-600 text-center mb-14 max-w-2xl mx-auto">
            Florida has over 33,000 home builders alone — and thousands more service contractors
            competing for attention. Most directories just list anyone who pays.{' '}
            <strong className="text-gray-900">We&apos;re different.</strong>
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {CERTIFY_COLS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="text-center p-8 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm"
              >
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What This Means For Your Business ───────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            What This Means For Your Business
          </h2>
          <p className="text-gray-500 text-center mb-14">
            Verified contractors stand out. Stand out and you win.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {BUSINESS_BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-5 p-6 rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Can Join ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Who Can Join
          </h2>
          <p className="text-gray-600 mb-8">
            We work with established service businesses in Florida.
          </p>

          <ul className="inline-flex flex-col items-start gap-3 mb-10 text-left">
            {REQUIREMENTS.map((req) => (
              <li key={req} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>

          <p className="text-gray-500 text-sm">
            Currently covering: Roofing, Gutters, Pool Service, Landscaping, HVAC, Plumbing,
            Electrical, Painting, Pressure Washing, Fencing, and 25+ more categories.
          </p>
        </div>
      </section>

      {/* ── Powered by DunaHub ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 sm:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                Powered by DunaHub
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Your leads, managed professionally
              </h2>

              <p className="text-gray-600 leading-relaxed mb-8">
                TheBestFlorida partners with DunaHub to give every contractor a free professional
                CRM. Track leads, schedule jobs, send quotes, and communicate with customers —
                all in one place.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {CRM_FEATURES.map((feat) => (
                  <span
                    key={feat}
                    className="flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {feat}
                  </span>
                ))}
              </div>

              <a
                href="https://dunahub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                Learn more about DunaHub
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Florida Service Market — At a Glance ────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            Florida Service Market — At a Glance
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Why now is the perfect time to grow your business in the Sunshine State.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {MARKET_STATS.map(({ value, label, source }) => (
              <div
                key={value}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-2">{value}</div>
                <p className="text-sm text-gray-700 leading-snug mb-2">{label}</p>
                <p className="text-xs text-gray-400">{source}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            Florida&apos;s home services market is fueled by population growth, an aging housing
            stock, hurricane-related repairs, and year-round outdoor maintenance. There has never
            been a better time for established service professionals to expand their reach.
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Featured?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Join the verified contractors growing their business with TheBestFlorida.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-blue-200/60 mt-6">
            No credit card required · 100% free · Takes 5 minutes
          </p>

          <p className="text-xs text-blue-200/40 mt-3">
            Selective verification process. Not all applicants are accepted.
          </p>
        </div>
      </section>

    </main>
  )
}
