'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { TABLES } from '@/types'
import type { Category, City } from '@/types'

const POPULAR = [
  { label: 'Landscaping',    slug: 'landscaping' },
  { label: 'House Cleaning', slug: 'house-cleaning' },
  { label: 'HVAC',           slug: 'hvac' },
  { label: 'Plumbing',       slug: 'plumbing' },
  { label: 'Roofing',        slug: 'roofing' },
]

export function Hero() {
  const router = useRouter()
  const [service, setService] = useState('')
  const [city, setCity]     = useState('')
  const [categories, setCategories] = useState<Pick<Category, 'name' | 'slug' | 'icon'>[]>([])
  const [cities, setCities]         = useState<Pick<City, 'name' | 'slug'>[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from(TABLES.categories).select('name, slug, icon').order('display_order'),
      supabase.from(TABLES.cities).select('name, slug').order('name'),
    ]).then(([{ data: cats }, { data: cts }]) => {
      setCategories(cats ?? [])
      setCities(cts ?? [])
      setLoadingOptions(false)
    })
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (service) params.set('service', service)
    if (city)    params.set('city', city)
    const qs = params.toString()
    router.push(qs ? `/search?${qs}` : '/search')
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 lg:py-28 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100/40 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Trusted by Florida homeowners since 2024
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
          Find Trusted Pros
          <br />
          <span className="text-blue-600">for Your Home</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with top-rated local professionals recommended
          by your Florida neighbors. Get free quotes in minutes.
        </p>

        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col md:flex-row gap-2"
        >
          {/* Service select */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              disabled={loadingOptions}
              className="w-full h-12 pl-10 pr-8 rounded-xl border-0 bg-transparent text-base text-gray-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer disabled:text-gray-400"
            >
              <option value="">What service do you need?</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:block w-px bg-gray-200 self-stretch my-1" />

          {/* City select */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loadingOptions}
              className="w-full h-12 pl-10 pr-8 rounded-xl border-0 bg-transparent text-base text-gray-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer disabled:text-gray-400"
            >
              <option value="">Any city in Florida</option>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-base flex-shrink-0 rounded-xl"
          >
            Search
          </Button>
        </form>

        {/* Popular quick-picks */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 items-center">
          <span className="text-gray-400 text-sm">Popular:</span>
          {POPULAR.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => {
                setService(s.slug)
                router.push(`/search?service=${s.slug}`)
              }}
              className="text-sm text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 px-3 py-1 rounded-full transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-1.5"><span className="font-semibold text-gray-700">500+</span> verified professionals</span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1.5"><span className="font-semibold text-gray-700">35+</span> service categories</span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1.5"><span className="font-semibold text-gray-700">100%</span> free for homeowners</span>
        </div>
      </div>
    </section>
  )
}
