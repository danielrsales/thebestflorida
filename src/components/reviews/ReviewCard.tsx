import { Star, ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react'
import type { Review } from '@/lib/reviews'

interface ReviewCardProps {
  review: Review
  showResponse?: boolean
}

const COST_RANGES = [
  'Under $500', '$500–$1,000', '$1,000–$5,000',
  '$5,000–$10,000', '$10,000–$25,000', 'Over $25,000',
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
        />
      ))}
    </div>
  )
}

export function ReviewCard({ review, showResponse = true }: ReviewCardProps) {
  const subRatings = [
    { label: 'Quality', value: review.rating_quality },
    { label: 'Punctuality', value: review.rating_punctuality },
    { label: 'Price', value: review.rating_price },
    { label: 'Communication', value: review.rating_communication },
  ].filter((r) => r.value !== null)

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{review.reviewer_name}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Stars rating={review.rating_overall} />
          <span className="text-sm font-bold text-gray-800">{review.rating_overall.toFixed(1)}</span>
        </div>
      </div>

      {/* Title + content */}
      {review.title && (
        <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>
      )}
      <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>

      {/* Pros / Cons */}
      {(review.pros || review.cons) && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {review.pros && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-800 mb-1">Pros</p>
              <p className="text-xs text-green-700">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-800 mb-1">Cons</p>
              <p className="text-xs text-red-700">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Sub-ratings */}
      {subRatings.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {subRatings.map((r) => (
            <div key={r.label} className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">{r.label}:</span>
              <Stars rating={r.value!} />
            </div>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        {review.service_type && <span>Service: {review.service_type}</span>}
        {review.project_cost_range && <span>Cost: {review.project_cost_range}</span>}
        {review.would_recommend && (
          <span className="inline-flex items-center gap-1 text-blue-600">
            <ThumbsUp className="w-3 h-3" />
            Would recommend
          </span>
        )}
      </div>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {review.photos.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Review photo ${i + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-gray-100"
            />
          ))}
        </div>
      )}

      {/* Contractor response */}
      {showResponse && review.contractor_response && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-800 flex items-center gap-1 mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Response from the business
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">{review.contractor_response}</p>
          {review.contractor_response_at && (
            <p className="text-xs text-blue-400 mt-1">
              {new Date(review.contractor_response_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
