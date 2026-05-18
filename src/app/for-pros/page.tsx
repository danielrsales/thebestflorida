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
  Building2,
  Eye,
  Info,
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
    title: 'Create Your Free Profile',
    description:
      'Sign up for free and tell us about your business — services you offer, cities you cover, and your experience. No requirements, no approval needed. Takes less than 5 minutes.',
  },
  {
    icon: Bell,
    title: 'Start Receiving Leads',
    description:
      'Homeowners in your area request quotes through TheBestFlorida. You get notified instantly and can purchase leads that match your services.',
  },
  {
    icon: Handshake,
    title: 'Grow Your Business',
    description:
      'Manage your leads with DunaHub, our free CRM. Track customers, schedule jobs, send quotes, and close more deals.',
  },
]

const BENEFITS = [
  {
    icon: Bell,
    title: 'Access to qualified leads',
    description:
      'Homeowners in Florida search for services on our platform. Purchase leads that match your category and city through DunaHub.',
  },
  {
    icon: LayoutDashboard,
    title: 'Free CRM via DunaHub',
    description:
      'Every contractor gets free access to DunaHub — pipeline, inbox, scheduling, and invoicing.',
  },
  {
    icon: Building2,
    title: 'Business profile page',
    description:
      'Your own profile on TheBestFlorida where homeowners can find your services, reviews, and contact info.',
  },
  {
    icon: Zap,
    title: 'SMS & email notifications',
    description:
      'Get notified instantly when a new lead matches your services. Never miss an opportunity.',
  },
  {
    icon: Ban,
    title: 'No contracts, no fees to join',
    description:
      'Listing your business is 100% free. You only pay for leads you choose to purchase.',
  },
  {
    icon: Eye,
    title: 'Marketplace visibility',
    description:
      'Be visible to 8.6 million Florida homeowners searching for trusted service pros.',
  },
]

const REPUTATION_STATS = [
  { pct: '91%', label: 'of homeowners read online reviews before hiring a contractor' },
  { pct: '68%', label: 'of U.S. homeowners used a home service app in 2023' },
  { pct: '75%', label: 'of consumers leverage online platforms to book or research services' },
  { pct: '42%', label: 'of consumers prefer booking home services online' },
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

const CERT_REQUIREMENTS = [
  '4.5+ Google rating with at least 20 reviews',
  'Valid Florida license',
  'Active insurance coverage',
  'At least 1 year in business',
  'Clean BBB record',
  'Active website',
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

      {/* 1 ── Hero ───────────────────────────────────────────────────────── */}
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

      {/* 2 ── The Florida Opportunity ────────────────────────────────────── */}
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

      {/* 3 ── How It Works ───────────────────────────────────────────────── */}
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

      {/* 4 ── What You Get ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            What You Get
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Everything you get by listing your business — no certification required.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3 shadow-sm"
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

      {/* 5 ── Intermediate CTA ───────────────────────────────────────────── */}
      <section className="relative py-16 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to start getting leads?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join hundreds of Florida service professionals already on TheBestFlorida.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business — It&apos;s Free
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-blue-200/60 mt-5">
            No certification required · No credit card · Takes 5 minutes
          </p>
        </div>
      </section>

      {/* 6 ── Transition: Want to Stand Out Even More? ───────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
            Optional Program
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Want to Stand Out Even More?
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
            Listing your business gets you leads. But earning our{' '}
            <strong className="text-gray-900">TheBestFlorida Certified</strong> badge gets you
            credibility, visibility, and trust that your competitors don&apos;t have.{' '}
            Certification is optional — and free for qualified businesses.
          </p>
        </div>
      </section>

      {/* 7 ── Why Online Reputation Matters ─────────────────────────────── */}
      <section className="py-20 bg-gray-50">
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

      {/* 8 ── We Don't Just List — We Certify ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Callout banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-12 max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Certification is optional and separate from your free listing.</strong>{' '}
              Any Florida service business can join TheBestFlorida. Certification is for
              businesses that want to earn our verified trust badge.
            </p>
          </div>

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

      {/* 9 ── What This Means For Your Business ─────────────────────────── */}
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

      {/* 10 ── Who Can Join ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Who Can Join TheBestFlorida
          </h2>
          <p className="text-gray-600 mb-10">
            Any active service business in Florida.
          </p>

          {/* Open listing requirements */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 mb-10 text-left max-w-xl mx-auto">
            <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-4">
              To create your free listing:
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm text-gray-800">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                Active service business in Florida
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-800">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>
                  <strong>That&apos;s it</strong> — no other requirements to join
                </span>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8 max-w-xl mx-auto">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Optional — Certification
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Certification requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 text-left max-w-xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              For TheBestFlorida Certification (optional):
            </h3>
            <ul className="flex flex-col gap-3">
              {CERT_REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-center gap-3 text-sm text-gray-700">
                  <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-gray-400 text-xs mt-6">
            Currently covering: Roofing, Gutters, Pool Service, Landscaping, HVAC, Plumbing,
            Electrical, Painting, Pressure Washing, Fencing, and 25+ more categories.
          </p>
        </div>
      </section>

      {/* 11 ── Powered by DunaHub ─────────────────────────────────────────── */}
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

      {/* 12 ── Florida Service Market — At a Glance ──────────────────────── */}
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

      {/* 13 ── Final CTA ──────────────────────────────────────────────────── */}
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
            Ready to Get More Customers?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Join TheBestFlorida — it&apos;s free, fast, and open to all Florida service businesses.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-blue-200/60 mt-6">
            Free to join · Certification available for qualified pros
          </p>
        </div>
      </section>

    </main>
  )
}
