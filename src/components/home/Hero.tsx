'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const POPULAR = ['Landscaping', 'House Cleaning', 'HVAC', 'Plumbing', 'Roofing']

export function Hero() {
  const router = useRouter()
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const s = service.toLowerCase().replace(/\s+/g, '-')
    const l = location.toLowerCase().replace(/[\s,]+/g, '-')
    if (s && l) router.push(`/${s}/${l}`)
    else if (s) router.push(`/${s}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

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
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="What service do you need?"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="pl-10 h-12 border-0 focus-visible:ring-0 text-base"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="City or ZIP code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 border-0 focus-visible:ring-0 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-base">
            Search
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2 items-center">
          <span className="text-blue-200 text-sm">Popular:</span>
          {POPULAR.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setService(s)}
              className="text-sm text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
