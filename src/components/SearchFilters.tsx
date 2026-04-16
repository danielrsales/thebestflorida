'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Category, City } from '@/types'

interface CurrentFilters {
  service?: string
  city?: string
  rating?: string
  q?: string
}

interface SearchFiltersProps {
  categories: Pick<Category, 'id' | 'name' | 'slug' | 'icon'>[]
  cities: Pick<City, 'id' | 'name' | 'slug'>[]
  current: CurrentFilters
}

const RATING_OPTIONS = [
  { label: 'Any rating', value: '' },
  { label: '3+ stars', value: '3' },
  { label: '4+ stars', value: '4' },
  { label: '4.5+ stars', value: '4.5' },
]

export function SearchFilters({ categories, cities, current }: SearchFiltersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function buildUrl(overrides: Partial<CurrentFilters>) {
    const params = new URLSearchParams()
    const merged = { ...current, ...overrides }
    if (merged.service) params.set('service', merged.service)
    if (merged.city)    params.set('city', merged.city)
    if (merged.rating)  params.set('rating', merged.rating)
    if (merged.q)       params.set('q', merged.q)
    const qs = params.toString()
    return qs ? `/search?${qs}` : '/search'
  }

  function navigate(overrides: Partial<CurrentFilters>) {
    startTransition(() => router.push(buildUrl(overrides)))
  }

  const activeCount = [current.service, current.city, current.rating, current.q].filter(Boolean).length

  return (
    <div className="bg-white rounded-xl border divide-y divide-gray-100 sticky top-[57px]">

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={() => navigate({ service: '', city: '', rating: '', q: '' })}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Text search */}
      <div className="px-5 py-4 space-y-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Keyword
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Business name…"
            defaultValue={current.q ?? ''}
            className="pl-9 h-10 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate({ q: (e.target as HTMLInputElement).value.trim() || undefined })
              }
            }}
            onBlur={(e) => {
              const val = e.target.value.trim()
              if (val !== (current.q ?? '')) {
                navigate({ q: val || undefined })
              }
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="px-5 py-4 space-y-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Service
        </label>
        <select
          value={current.service ?? ''}
          onChange={(e) => navigate({ service: e.target.value || undefined })}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
        >
          <option value="">All services</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="px-5 py-4 space-y-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          City
        </label>
        <select
          value={current.city ?? ''}
          onChange={(e) => navigate({ city: e.target.value || undefined })}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum rating */}
      <div className="px-5 py-4 space-y-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Minimum rating
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => navigate({ rating: opt.value || undefined })}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                (current.rating ?? '') === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {activeCount > 0 && (
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-1.5">
            {current.service && (
              <FilterTag
                label={categories.find((c) => c.slug === current.service)?.name ?? current.service}
                onRemove={() => navigate({ service: '' })}
              />
            )}
            {current.city && (
              <FilterTag
                label={cities.find((c) => c.slug === current.city)?.name ?? current.city}
                onRemove={() => navigate({ city: '' })}
              />
            )}
            {current.rating && (
              <FilterTag
                label={`${current.rating}+ ★`}
                onRemove={() => navigate({ rating: '' })}
              />
            )}
            {current.q && (
              <FilterTag
                label={`"${current.q}"`}
                onRemove={() => navigate({ q: '' })}
              />
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="px-5 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-3 h-3 animate-spin" />
          Updating results…
        </div>
      )}
    </div>
  )
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900 transition-colors" aria-label={`Remove ${label} filter`}>
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  )
}
