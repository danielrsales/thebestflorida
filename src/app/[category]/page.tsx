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
  params: { category: string }
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const supabase = createBuildClient()
  const { data } = await supabase.from(TABLES.categories).select('slug')
  return (data ?? []).map((c) => ({ category: c.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data: cat } = await supabase
    .from(TABLES.categories)
    .select('name, description')
    .eq('slug', params.category)
    .single()

  if (!cat) return { title: 'Service Not Found' }

  const title = `Best ${cat.name} Companies in Florida`
  const description =
    cat.description ??
    `Find top-rated ${cat.name.toLowerCase()} professionals in Florida. Compare verified, insured local experts and get free quotes today.`
  const url = `${SITE_URL}/${params.category}`

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

export default async function CategoryPage({ params }: Props) {
  const supabase = createServerClient()

  const { data: category } = await supabase
    .from(TABLES.categories)
    .select('*')
    .eq('slug', params.category)
    .single<Category>()

  if (!category) notFound()

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
        .eq('status', 'active')
        .order('is_sponsored', { ascending: false })
        .order('rating', { ascending: false })
        .returns<Contractor[]>()
    : { data: [] as Contractor[] }

  const cityIds = Array.from(new Set((contractors ?? []).map((c) => c.city_id).filter(Boolean))) as number[]
  const { data: cities } = cityIds.length
    ? await supabase
        .from(TABLES.cities)
        .select('name, slug')
        .in('id', cityIds)
        .order('name')
        .returns<Pick<City, 'name' | 'slug'>[]>()
    : { data: [] as Pick<City, 'name' | 'slug'>[] }

  const list = contractors ?? []

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-blue-300 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            <span className="text-white font-medium" aria-current="page">{category.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">{category.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              Best {category.name} in Florida
            </h1>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl">
            {category.description ??
              `Top-rated ${category.name.toLowerCase()} professionals — verified, insured, and ready to help.`}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-blue-300">
            <span>{list.length} professional{list.length !== 1 ? 's' : ''} found</span>
            {list.some((c) => c.is_verified) && <span>✓ Verified pros available</span>}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            {(cities ?? []).length > 0 && (
              <div className="bg-white rounded-xl border p-5 sticky top-4">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" aria-hidden />
                  Filter by City
                </h2>
                <ul className="space-y-1">
                  {(cities ?? []).map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/${params.category}/${city.slug}`}
                        className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Results */}
          <div className="flex-1">
            {list.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <p className="text-4xl mb-4" aria-hidden="true">{category.icon}</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No {category.name} pros listed yet
                </h2>
                <p className="text-gray-500 text-sm">
                  We&apos;re adding new professionals every week. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {list.map((contractor) => (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    categorySlug={params.category}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
