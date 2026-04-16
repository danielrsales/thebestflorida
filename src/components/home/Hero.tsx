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
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Find the <span className="text-yellow-400">Best</span> Service Pros
          <br />in Florida
        </h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          We handpick top-rated professionals so you don&apos;t have to.
          Get free quotes from verified local experts.
        </p>

        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2"
        >
          {/* Service select */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              disabled={loadingOptions}
              className="w-full h-12 pl-10 pr-8 rounded-lg border-0 bg-transparent text-base text-gray-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer disabled:text-gray-400"
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
              className="w-full h-12 pl-10 pr-8 rounded-lg border-0 bg-transparent text-base text-gray-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer disabled:text-gray-400"
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
            className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-base flex-shrink-0"
          >
            Search
          </Button>
        </form>

        {/* Popular quick-picks */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 items-center">
          <span className="text-blue-200 text-sm">Popular:</span>
          {POPULAR.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => {
                setService(s.slug)
                router.push(`/search?service=${s.slug}`)
              }}
              className="text-sm text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
