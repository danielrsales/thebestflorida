import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Shield } from 'lucide-react'

interface Pro {
  id: number
  slug: string
  business_name: string
  logo_url: string | null
  rating: number
  reviews_count: number
  tagline: string | null
  city: { name: string } | null
  categories: { name: string }[]
}

interface FeaturedProsProps {
  pros: Pro[]
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
          fill="currentColor"
        />
      ))}
    </div>
  )
}

function ProCard({ pro }: { pro: Pro }) {
  const city = (pro.city as unknown as { name: string } | null)?.name
  const cats = (pro.categories as unknown as { name: string }[] | null) ?? []
  const primaryCat = cats[0]?.name

  return (
    <Link
      href={`/pro/${pro.slug}`}
      className="group flex flex-col bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Logo / placeholder */}
      <div className="h-36 bg-gradient-to-br from-blue-900/40 to-gray-800 flex items-center justify-center relative overflow-hidden">
        {pro.logo_url ? (
          <Image
            src={pro.logo_url}
            alt={pro.business_name}
            fill
            className="object-contain p-4"
            unoptimized={pro.logo_url.includes('supabase')}
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-300">
              {pro.business_name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-white text-sm leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
            {pro.business_name}
          </h3>
          {pro.rating > 0 && (
            <span className="text-xs font-bold text-yellow-400 shrink-0">{pro.rating.toFixed(1)}</span>
          )}
        </div>

        {pro.rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <StarRow rating={pro.rating} />
            {pro.reviews_count > 0 && (
              <span className="text-xs text-gray-500">({pro.reviews_count})</span>
            )}
          </div>
        )}

        {pro.tagline && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed flex-1">
            {pro.tagline}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800">
          {primaryCat && (
            <span className="text-xs text-blue-400 font-medium">{primaryCat}</span>
          )}
          {city && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {city}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function PlaceholderCard() {
  return (
    <div className="flex flex-col bg-gray-900 rounded-2xl border border-gray-800 border-dashed overflow-hidden items-center justify-center p-8 text-center min-h-[220px]">
      <Shield className="w-8 h-8 text-gray-700 mb-3" />
      <p className="text-sm font-medium text-gray-600">Coming Soon</p>
      <p className="text-xs text-gray-700 mt-1">Top pros being verified</p>
    </div>
  )
}

export function FeaturedPros({ pros }: FeaturedProsProps) {
  const slots = [...pros]
  while (slots.length < 4) slots.push(null as unknown as Pro)

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Handpicked for You</p>
          <h2 className="text-3xl font-bold text-white mb-3">Top-Rated Professionals</h2>
          <p className="text-gray-400 text-lg">Trusted by Florida homeowners</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {slots.map((pro, i) =>
            pro ? <ProCard key={pro.slug} pro={pro} /> : <PlaceholderCard key={`placeholder-${i}`} />
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Find a Pro Near You →
          </Link>
        </div>
      </div>
    </section>
  )
}
