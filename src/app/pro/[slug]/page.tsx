import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Phone, Globe, Mail, Calendar, Shield, CheckCircle,
  Clock, ChevronRight, Star,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { createBuildClient } from '@/lib/supabase/build'
import { StarRating } from '@/components/StarRating'
import { JsonLd } from '@/components/JsonLd'
import { TABLES } from '@/types'
import type { Contractor, ContractorReview, Category } from '@/types'
import { QuoteButton } from './QuoteButton'
import { getApprovedReviews } from '@/lib/reviews'
import { getContractorBadges } from '@/lib/badges'
import { ReviewList } from '@/components/reviews/ReviewList'
import { BadgeList } from '@/components/badges/BadgeList'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thebestflorida.com'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const supabase = createBuildClient()
  const { data } = await supabase
    .from(TABLES.contractors)
    .select('slug')
    .eq('status', 'active')
  return (data ?? []).map((c) => ({ slug: c.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from(TABLES.contractors)
    .select('business_name, tagline, logo_url, city:tbf_cities(name)')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single()

  if (!data) return { title: 'Pro Not Found' }

  const city = (data.city as unknown as { name: string } | null)?.name
  const title = `${data.business_name}${city ? ` — ${city}, FL` : ''}`
  const description =
    data.tagline ??
    `Learn more about ${data.business_name}, a trusted service professional${city ? ` in ${city}, Florida` : ' in Florida'}. View credentials, reviews, and request a free quote.`
  const url = `${SITE_URL}/pro/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: data.logo_url ? [{ url: data.logo_url, alt: data.business_name }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: data.logo_url ? [data.logo_url] : [],
    },
  }
}

export default async function ProProfilePage({ params }: Props) {
  const supabase = createServerClient()

  // Fetch contractor
  const { data: contractor } = await supabase
    .from(TABLES.contractors)
    .select('*, city:tbf_cities(name, slug)')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single<Contractor>()

  if (!contractor) notFound()

  // Fetch categories, legacy reviews, new verified reviews, and badges in parallel
  const [{ data: catLinks }, { data: reviews }, verifiedReviews, contractorBadges] = await Promise.all([
    supabase
      .from(TABLES.contractor_categories)
      .select('category:tbf_categories(name, slug)')
      .eq('contractor_id', contractor.id),
    supabase
      .from(TABLES.contractor_reviews)
      .select('*')
      .eq('contractor_id', contractor.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .returns<ContractorReview[]>(),
    getApprovedReviews(String(contractor.id)),
    getContractorBadges(String(contractor.id)),
  ])

  const categories = (catLinks ?? [])
    .map((r) => r.category as unknown as Pick<Category, 'name' | 'slug'> | null)
    .filter(Boolean) as Pick<Category, 'name' | 'slug'>[]

  const reviewList = reviews ?? []

  const trustBadges = [
    { show: contractor.is_verified,           icon: '✓', label: 'Verified Pro',         desc: 'Identity and license verified' },
    { show: contractor.is_insured,            icon: '🛡', label: 'Insured',              desc: 'Carries liability insurance' },
    { show: contractor.is_bonded,             icon: '🔒', label: 'Bonded',               desc: 'Performance bond on file' },
    { show: contractor.is_background_checked, icon: '👤', label: 'Background Checked',   desc: 'Passed criminal background check' },
  ].filter((b) => b.show)

  // ─── JSON-LD ──────────────────────────────────────────────────────────────
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contractor.business_name,
    url: `${SITE_URL}/pro/${contractor.slug}`,
    ...(contractor.logo_url && { image: contractor.logo_url }),
    ...(contractor.description && { description: contractor.description }),
    ...(contractor.phone && { telephone: contractor.phone }),
    ...(contractor.email && { email: contractor.email }),
    ...(contractor.website && { sameAs: [contractor.website] }),
    ...(contractor.city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: contractor.city.name,
        addressRegion: 'FL',
        addressCountry: 'US',
      },
    }),
    ...(contractor.rating > 0 && contractor.reviews_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: contractor.rating.toFixed(1),
        reviewCount: contractor.reviews_count,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(reviewList.length > 0 && {
      review: reviewList.slice(0, 5).map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.reviewer_name },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating },
        ...(r.content && { reviewBody: r.content }),
        datePublished: r.created_at.split('T')[0],
      })),
    }),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={jsonLd} />

      {/* Cover image / hero */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden">
        {contractor.cover_image_url && (
          <Image
            src={contractor.cover_image_url}
            alt={contractor.business_name}
            fill
            className="object-cover opacity-40"
          />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-gray-500 text-sm pt-4 mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          {categories[0] && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/${categories[0].slug}`}
                className="hover:text-blue-600 transition-colors"
              >
                {categories[0].name}
              </Link>
              {contractor.city && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <Link
                    href={`/${categories[0].slug}/${contractor.city.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {contractor.city.name}
                  </Link>
                </>
              )}
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium truncate">{contractor.business_name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 pb-16">

          {/* ── Main column ───────────────────────────────────── */}
          <div className="flex-1 space-y-6">

            {/* Business header */}
            <div className="bg-white rounded-xl border p-6 -mt-10 relative shadow-sm">
              <div className="flex items-start gap-5">
                {/* Logo */}
                {contractor.logo_url ? (
                  <Image
                    src={contractor.logo_url}
                    alt={contractor.business_name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                    {contractor.business_name[0]}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{contractor.business_name}</h1>
                    {contractor.is_verified && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                    {contractor.is_sponsored && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {contractor.tagline && (
                    <p className="text-gray-500 mt-1">{contractor.tagline}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <StarRating
                      rating={contractor.rating}
                      count={contractor.reviews_count}
                      size="md"
                    />
                    {contractor.city && (
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {contractor.city.name}, FL
                      </span>
                    )}
                    {contractor.year_established && (
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Est. {contractor.year_established}
                      </span>
                    )}
                  </div>

                  {categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/${cat.slug}`}
                          className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium hover:bg-blue-100 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About */}
            {contractor.description && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {contractor.description}
                </p>
              </div>
            )}

            {/* Trust badges (legacy flags) + new dynamic badges */}
            {(trustBadges.length > 0 || contractorBadges.length > 0) && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Verified Credentials
                </h2>
                {/* Dynamic badges */}
                {contractorBadges.length > 0 && (
                  <div className="mb-4">
                    <BadgeList badges={contractorBadges} size="md" />
                  </div>
                )}
                {/* Legacy trust flags */}
                {trustBadges.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {trustBadges.map((b) => (
                      <div key={b.label} className="flex flex-col items-center text-center p-3 bg-green-50 rounded-xl border border-green-100">
                        <span className="text-xl mb-1">{b.icon}</span>
                        <p className="text-xs font-bold text-green-800">{b.label}</p>
                        <p className="text-xs text-green-600 mt-0.5 leading-tight">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Verified Reviews (new system) */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Customer Reviews</h2>
              <ReviewList
                reviews={verifiedReviews}
                contractorSlug={contractor.slug}
                businessName={contractor.business_name}
              />
            </div>

            {/* Legacy reviews (imported data) */}
            {reviewList.length > 0 && verifiedReviews.length === 0 && (
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-900">
                    Reviews
                    {contractor.reviews_count > 0 && (
                      <span className="text-gray-400 font-normal ml-2">({contractor.reviews_count})</span>
                    )}
                  </h2>
                  {contractor.rating > 0 && (
                    <StarRating rating={contractor.rating} size="lg" />
                  )}
                </div>
                <div className="space-y-5">
                  {reviewList.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <aside className="lg:w-72 flex-shrink-0 space-y-5">

            {/* CTA */}
            <div className="bg-white rounded-xl border p-5 shadow-sm sticky top-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Get a free quote from
              </p>
              <p className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {contractor.business_name}
              </p>

              {contractor.response_time_hours && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <Clock className="w-3.5 h-3.5 text-green-500" />
                  Typically responds in {contractor.response_time_hours}h
                </p>
              )}

              <QuoteButton contractor={contractor} />

              {contractor.phone && (
                <a
                  href={`tel:${contractor.phone}`}
                  className="mt-3 flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {contractor.phone}
                </a>
              )}
            </div>

            {/* Contact info */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Info</h3>
              <ul className="space-y-2.5 text-sm">
                {contractor.city && (
                  <li className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {contractor.city.name}, Florida
                  </li>
                )}
                {contractor.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${contractor.phone}`} className="text-blue-600 hover:underline">
                      {contractor.phone}
                    </a>
                  </li>
                )}
                {contractor.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${contractor.email}`} className="text-blue-600 hover:underline truncate">
                      {contractor.email}
                    </a>
                  </li>
                )}
                {contractor.website && (
                  <li className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={contractor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {contractor.website.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}

function ReviewItem({ review }: { review: ContractorReview }) {
  return (
    <div className="border-t border-gray-100 pt-5 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900">{review.reviewer_name}</p>
            {review.is_verified_customer && (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
                ✓ Verified
              </span>
            )}
            {review.reviewer_location && (
              <span className="text-xs text-gray-400">{review.reviewer_location}</span>
            )}
          </div>
          {review.title && (
            <p className="text-sm font-medium text-gray-800 mt-1">{review.title}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1,2,3,4,5].map((i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
              fill="currentColor"
            />
          ))}
        </div>
      </div>

      {review.content && (
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.content}</p>
      )}

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        {review.project_type && <span>Project: {review.project_type}</span>}
        {review.project_cost_range && <span>Cost: {review.project_cost_range}</span>}
        <span>{new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
      </div>
    </div>
  )
}
