import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { createBuildClient } from '@/lib/supabase/build'
import { ContractorCard } from '@/components/ContractorCard'
import { TABLES } from '@/types'
import type { Contractor, Category, City } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thebestflorida.com'

export const revalidate = 3600

interface Props {
  params: { category: string; city: string }
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const supabase = createBuildClient()

  // All category slugs
  const { data: categories } = await supabase
    .from(TABLES.categories)
    .select('id, slug')

  if (!categories?.length) return []

  // All active contractor→category+city combos in one query
  const { data: links } = await supabase
    .from(TABLES.contractor_categories)
    .select('category_id, contractor:tbf_contractors(city_id)')

  if (!links?.length) return []

  type LinkRow = { category_id: number; contractor: { city_id: number | null } | null }
  const typedLinks = links as unknown as LinkRow[]

  // Collect unique city_ids per category_id
  const map = new Map<number, number[]>()
  for (const row of typedLinks) {
    const cityId = row.contractor?.city_id
    if (!cityId) continue
    if (!map.has(row.category_id)) map.set(row.category_id, [])
    map.get(row.category_id)!.push(cityId)
  }

  // Fetch all city slugs we'll need
  const allCityIds = Array.from(new Set(
    typedLinks.map((r) => r.contractor?.city_id).filter((id): id is number => id != null)
  ))

  const { data: cities } = await supabase
    .from(TABLES.cities)
    .select('id, slug')
    .in('id', allCityIds)

  const cityById = new Map((cities ?? []).map((c) => [c.id, c.slug]))
  const catBySlug = new Map(categories.map((c) => [c.id, c.slug]))

  const params: { category: string; city: string }[] = []
  for (const [catId, cityIds] of Array.from(map.entries())) {
    const catSlug = catBySlug.get(catId)
    if (!catSlug) continue
    for (const cityId of Array.from(new Set(cityIds))) {
      const citySlug = cityById.get(cityId)
      if (citySlug) params.push({ category: catSlug, city: citySlug })
    }
  }

  return params
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()

  const [{ data: cat }, { data: city }] = await Promise.all([
    supabase.from(TABLES.categories).select('name').eq('slug', params.category).single(),
    supabase.from(TABLES.cities).select('name, county').eq('slug', params.city).single(),
  ])

  if (!cat || !city) return { title: 'Not Found' }

  const title = `Best ${cat.name} in ${city.name}, Florida`
  const description = `Find top-rated, verified ${cat.name.toLowerCase()} professionals in ${city.name}${city.county ? `, ${city.county} County` : ''}, FL. Compare quotes from insured local experts — free and fast.`
  const url = `${SITE_URL}/${params.category}/${params.city}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryCityPage({ params }: Props) {
  const supabase = createServerClient()

  const [{ data: category }, { data: city }] = await Promise.all([
    supabase.from(TABLES.categories).select('*').eq('slug', params.category).single<Category>(),
    supabase.from(TABLES.cities).select('*').eq('slug', params.city).single<City>(),
  ])

  if (!category || !city) notFound()

  const { data: catLinks } = await supabase
    .from(TABLES.contractor_categories)
    .select('contractor_id')
    .eq('category_id', category.id)

  const contractorIds = catLinks?.map((r) => r.contractor_id) ?? []

  const { data: contractors } = contractorIds.length
    ? await supabase
        .from(TABLES.contractors)
        .select('*, city:tbf_cities(name, slug)')
        .in('id', contractorIds)
        .eq('city_id', city.id)
        .eq('status', 'active')
        .order('is_sponsored', { ascending: false })
        .order('rating', { ascending: false })
        .returns<Contractor[]>()
    : { data: [] as Contractor[] }

  const list = contractors ?? []

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-blue-300 text-sm mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            <Link href={`/${params.category}`} className="hover:text-white transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            <span className="text-white font-medium" aria-current="page">{city.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">{category.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              Best {category.name} in {city.name}, FL
            </h1>
          </div>

          <p className="text-blue-200 text-lg max-w-2xl">
            Top-rated {category.name.toLowerCase()} professionals in {city.name}
            {city.county ? `, ${city.county} County` : ''} — verified, insured, and ready to help.
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm text-blue-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {city.name}, Florida
            </span>
            <span>{list.length} pro{list.length !== 1 ? 's' : ''} available</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {list.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center max-w-lg mx-auto">
            <p className="text-4xl mb-4" aria-hidden="true">{category.icon}</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No {category.name} pros in {city.name} yet
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We don&apos;t have verified professionals in this city yet.
              Browse all {category.name} pros across Florida below.
            </p>
            <Link
              href={`/${params.category}`}
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >
              View all {category.name} pros in Florida →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((contractor) => (
              <ContractorCard
                key={contractor.id}
                contractor={contractor}
                categorySlug={params.category}
              />
            ))}
          </div>
        )}

        {/* SEO text block */}
        <div className="mt-12 bg-white rounded-xl border p-6 max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Hiring {category.name} in {city.name}, FL
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Finding a reliable {category.name.toLowerCase()} professional in {city.name} doesn&apos;t
            have to be stressful. Every pro on TheBestFlorida is manually reviewed to ensure they
            are licensed, insured, and have a proven track record in{' '}
            {city.county ? `${city.county} County` : 'Florida'}.
            Request a free quote from multiple providers to compare pricing and availability.
          </p>
        </div>
      </div>
    </div>
  )
}
