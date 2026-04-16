import type { Metadata } from 'next'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { createBuildClient } from '@/lib/supabase/build'
import { ContractorCard } from '@/components/ContractorCard'
import { SearchFilters } from '@/components/SearchFilters'
import { TABLES } from '@/types'
import type { Contractor, Category, City } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thebestflorida.com'
const RESULTS_LIMIT = 24

interface SearchParams {
  service?: string
  city?: string
  rating?: string
  q?: string
}

interface Props {
  searchParams: SearchParams
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { service, city, rating, q } = searchParams

  // Count active filters to decide on noindex
  const activeFilters = [service, city, rating, q].filter(Boolean).length
  // noindex: free-text search or 3+ combined filters (avoid duplicate-content crawl trap)
  const shouldNoIndex = !!q || activeFilters >= 3

  // Build a human-readable title
  let title = 'Search Service Pros in Florida'
  const parts: string[] = []

  if (service) {
    // Capitalise slug: "house-cleaning" → "House Cleaning"
    parts.push(service.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
  }
  if (city) {
    parts.push(`in ${city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}, FL`)
  }
  if (parts.length) title = `${parts.join(' ')} — Top Pros`

  const description = [
    'Find top-rated, verified Florida service professionals.',
    service && `Looking for ${service.replace(/-/g, ' ')} pros?`,
    city && `Serving ${city.replace(/-/g, ' ')}, Florida.`,
    'Compare quotes for free.',
  ].filter(Boolean).join(' ')

  // Canonical: point to static page when service (+city) exactly match a pre-rendered route
  const canonical =
    !q && !rating && service && city
      ? `${SITE_URL}/${service}/${city}`
      : !q && !rating && service && !city
        ? `${SITE_URL}/${service}`
        : undefined

  return {
    title,
    description,
    ...(shouldNoIndex && { robots: { index: false, follow: true } }),
    ...(canonical && { alternates: { canonical } }),
    openGraph: { title, description, url: `${SITE_URL}/search` },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: Props) {
  const { service, city, rating, q } = searchParams

  const supabase = createServerClient()
  const buildClient = createBuildClient()

  // ── Load filter options (categories + cities) for the sidebar ──────────────
  const [{ data: allCategories }, { data: allCities }] = await Promise.all([
    buildClient.from(TABLES.categories).select('id, name, slug, icon').order('display_order'),
    buildClient.from(TABLES.cities).select('id, name, slug').order('name'),
  ])

  // ── Resolve slugs → IDs ────────────────────────────────────────────────────
  const categoryRecord = service
    ? (allCategories ?? []).find((c) => c.slug === service)
    : null

  const cityRecord = city
    ? (allCities ?? []).find((c) => c.slug === city)
    : null

  // If service slug given but not found in DB, we still search without it
  let contractorIds: number[] | null = null
  if (categoryRecord) {
    const { data: links } = await supabase
      .from(TABLES.contractor_categories)
      .select('contractor_id')
      .eq('category_id', categoryRecord.id)
    contractorIds = (links ?? []).map((r) => r.contractor_id)
  }

  // ── Build contractor query ─────────────────────────────────────────────────
  let query = supabase
    .from(TABLES.contractors)
    .select('*, city:tbf_cities(name, slug)')
    .eq('status', 'active')
    .order('is_sponsored', { ascending: false })
    .order('rating', { ascending: false })
    .limit(RESULTS_LIMIT)

  if (contractorIds !== null) {
    if (contractorIds.length === 0) {
      // Category exists but no contractors → return empty
      contractorIds = [-1]
    }
    query = query.in('id', contractorIds)
  }

  if (cityRecord) {
    query = query.eq('city_id', cityRecord.id)
  }

  if (rating) {
    const minRating = parseFloat(rating)
    if (!isNaN(minRating)) query = query.gte('rating', minRating)
  }

  if (q?.trim()) {
    // ilike on name — Supabase doesn't support full-text on multiple columns in one .or() without RPC, so search name only
    query = query.ilike('business_name', `%${q.trim()}%`)
  }

  const { data: contractors } = await query.returns<Contractor[]>()
  const list = contractors ?? []

  // ── UI labels ──────────────────────────────────────────────────────────────
  const categoryLabel = categoryRecord?.name ?? (service ? service.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null)
  const cityLabel = cityRecord?.name ?? (city ? city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null)

  const hasFilters = !!(service || city || rating || q)
  const pageTitle = [categoryLabel, cityLabel ? `in ${cityLabel}, FL` : null].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">
            {pageTitle || 'All Service Pros in Florida'}
          </span>
          <span className="ml-auto text-sm text-gray-500 flex-shrink-0">
            {list.length}{list.length === RESULTS_LIMIT ? '+' : ''} result{list.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar: filters ──────────────────────────────────────────── */}
          <aside className="lg:w-64 flex-shrink-0">
            <SearchFilters
              categories={(allCategories ?? []) as Category[]}
              cities={(allCities ?? []) as City[]}
              current={{ service, city, rating, q }}
            />
          </aside>

          {/* ── Results ───────────────────────────────────────────────────── */}
          <div className="flex-1">

            {/* Canonical hint: link to dedicated page when exact match */}
            {!q && !rating && service && city && (
              <div className="mb-5 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm flex items-center justify-between gap-3">
                <span className="text-blue-800">
                  Viewing {categoryLabel} pros in {cityLabel} — also available as a dedicated page.
                </span>
                <Link
                  href={`/${service}/${city}`}
                  className="text-blue-700 font-semibold hover:underline flex-shrink-0"
                >
                  View page →
                </Link>
              </div>
            )}

            {list.length === 0 ? (
              <EmptyState hasFilters={hasFilters} categoryLabel={categoryLabel} cityLabel={cityLabel} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {list.map((contractor) => (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    categorySlug={service}
                  />
                ))}
              </div>
            )}

            {list.length === RESULTS_LIMIT && (
              <p className="mt-6 text-center text-sm text-gray-500">
                Showing first {RESULTS_LIMIT} results. Refine your filters to narrow down.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
  hasFilters,
  categoryLabel,
  cityLabel,
}: {
  hasFilters: boolean
  categoryLabel: string | null
  cityLabel: string | null
}) {
  return (
    <div className="bg-white rounded-xl border p-12 text-center">
      <p className="text-4xl mb-4">🔍</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No pros found</h2>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
        {hasFilters
          ? `We couldn't find ${categoryLabel ? categoryLabel.toLowerCase() + ' pros' : 'pros'}${cityLabel ? ` in ${cityLabel}` : ''} matching your filters. Try broadening your search.`
          : 'Enter a service or city to find local professionals.'}
      </p>
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm"
      >
        ← Clear all filters
      </Link>
    </div>
  )
}
