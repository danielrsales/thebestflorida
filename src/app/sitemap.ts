import type { MetadataRoute } from 'next'
import { createBuildClient } from '@/lib/supabase/build'
import { TABLES } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thebestflorida.com'

export const revalidate = 86400 // regenerate once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createBuildClient()

  // Fetch all data needed in parallel
  const [
    { data: categories },
    { data: contractors },
    { data: catLinks },
  ] = await Promise.all([
    supabase.from(TABLES.categories).select('slug, display_order'),
    supabase.from(TABLES.contractors).select('slug').eq('status', 'active'),
    supabase
      .from(TABLES.contractor_categories)
      .select('category_id, contractor:tbf_contractors(city_id, status)'),
  ])

  const now = new Date()

  // ─── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // ─── Category pages (/[category]) ──────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // ─── Category+city combos (/[category]/[city]) ─────────────────────────────
  type CatLinkRow = { category_id: number; contractor: { city_id: number | null; status: string } | null }
  const typedLinks = (catLinks ?? []) as unknown as CatLinkRow[]

  // Build unique (category_id, city_id) pairs from active contractors
  const pairMap = new Map<string, { catId: number; cityId: number }>()
  for (const row of typedLinks) {
    const c = row.contractor
    if (c?.status === 'active' && c.city_id) {
      const key = `${row.category_id}:${c.city_id}`
      if (!pairMap.has(key)) pairMap.set(key, { catId: row.category_id, cityId: c.city_id })
    }
  }

  // Fetch id→slug maps
  const [{ data: catsWithId }, { data: citiesWithId }] = await Promise.all([
    supabase.from(TABLES.categories).select('id, slug'),
    supabase.from(TABLES.cities).select('id, slug'),
  ])

  const catSlugById = new Map((catsWithId ?? []).map((c) => [c.id, c.slug]))
  const citySlugById = new Map((citiesWithId ?? []).map((c) => [c.id, c.slug]))

  const categoryCityPages: MetadataRoute.Sitemap = []
  for (const { catId, cityId } of Array.from(pairMap.values())) {
    const catSlug = catSlugById.get(catId)
    const citySlug = citySlugById.get(cityId)
    if (catSlug && citySlug) {
      categoryCityPages.push({
        url: `${SITE_URL}/${catSlug}/${citySlug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.7,
      })
    }
  }

  // ─── Contractor profiles (/pro/[slug]) ─────────────────────────────────────
  const proPages: MetadataRoute.Sitemap = (contractors ?? []).map((c) => ({
    url: `${SITE_URL}/pro/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...categoryCityPages,
    ...proPages,
  ]
}
