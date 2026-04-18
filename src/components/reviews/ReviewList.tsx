import { Star } from 'lucide-react'
import { ReviewCard } from './ReviewCard'
import type { Review } from '@/lib/reviews'

interface ReviewListProps {
  reviews: Review[]
  contractorSlug: string
  businessName: string
}

function RatingBar({ label, value, count }: { label: string; value: number; count: number }) {
  const pct = count > 0 ? Math.round((value / count) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className="bg-yellow-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-gray-400">{value > 0 ? value.toFixed(1) : '—'}</span>
    </div>
  )
}

export function ReviewList({ reviews, contractorSlug, businessName }: ReviewListProps) {
  const count = reviews.length

  const avg = (key: keyof Review) => {
    const vals = reviews.map((r) => r[key]).filter((v): v is number => typeof v === 'number')
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
  }

  const avgOverall = avg('rating_overall')
  const avgQuality = avg('rating_quality')
  const avgPunctuality = avg('rating_punctuality')
  const avgPrice = avg('rating_price')
  const avgComm = avg('rating_communication')

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating_overall) === star).length,
  }))

  return (
    <div>
      {/* Summary */}
      {count > 0 && (
        <div className="bg-gray-50 rounded-xl p-5 mb-6 flex flex-col sm:flex-row gap-6">
          {/* Overall */}
          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-5xl font-bold text-gray-900">{avgOverall.toFixed(1)}</span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i <= Math.round(avgOverall) ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 mt-1">{count} review{count !== 1 ? 's' : ''}</span>
          </div>

          {/* Star distribution */}
          <div className="flex-1 space-y-1.5">
            {starCounts.map(({ star, count: c }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-gray-500 text-right">{star}</span>
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-yellow-400 h-1.5 rounded-full"
                    style={{ width: count > 0 ? `${(c / count) * 100}%` : '0%' }}
                  />
                </div>
                <span className="w-4 text-gray-400">{c}</span>
              </div>
            ))}
          </div>

          {/* Sub-ratings */}
          <div className="flex-1 space-y-2">
            <RatingBar label="Quality" value={avgQuality} count={reviews.filter((r) => r.rating_quality !== null).length} />
            <RatingBar label="Punctuality" value={avgPunctuality} count={reviews.filter((r) => r.rating_punctuality !== null).length} />
            <RatingBar label="Price" value={avgPrice} count={reviews.filter((r) => r.rating_price !== null).length} />
            <RatingBar label="Communication" value={avgComm} count={reviews.filter((r) => r.rating_communication !== null).length} />
          </div>
        </div>
      )}

      {/* Write a review CTA */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          {count === 0 ? 'No reviews yet' : `${count} Verified Review${count !== 1 ? 's' : ''}`}
        </h3>
        <a
          href={`/review/${contractorSlug}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          + Write a Review
        </a>
      </div>

      {/* Review cards */}
      {count === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 text-gray-200" fill="currentColor" />
          <p className="text-sm">Be the first to review {businessName}!</p>
          <a
            href={`/review/${contractorSlug}`}
            className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Write a Review
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}
