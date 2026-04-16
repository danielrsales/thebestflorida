'use client'

import { useState, useEffect } from 'react'
import { Star, Loader2, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

interface Review {
  id: number
  reviewer_name: string
  reviewer_location: string | null
  rating: number
  title: string | null
  content: string | null
  project_type: string | null
  is_verified_customer: boolean
  created_at: string
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<number | null>(null)
  const [contractorRating, setContractorRating] = useState<number>(0)
  const [contractorReviewCount, setContractorReviewCount] = useState<number>(0)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    supabase
      .from('tbf_contractors')
      .select('id, rating, reviews_count')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(async ({ data: contractor }) => {
        if (!contractor) { setLoading(false); return }
        setContractorRating(contractor.rating ?? 0)
        setContractorReviewCount(contractor.reviews_count ?? 0)

        const { data } = await supabase
          .from('tbf_contractor_reviews')
          .select('id, reviewer_name, reviewer_location, rating, title, content, project_type, is_verified_customer, created_at')
          .eq('contractor_id', contractor.id)
          .order('created_at', { ascending: false })

        setReviews(data ?? [])
        setLoading(false)
      })
  }, [user])

  const filtered = filter ? reviews.filter((r) => r.rating === filter) : reviews

  const distribution = [5,4,3,2,1].map((n) => ({
    stars: n,
    count: reviews.filter((r) => r.rating === n).length,
    pct: reviews.length ? Math.round((reviews.filter((r) => r.rating === n).length / reviews.length) * 100) : 0,
  }))

  if (loading) {
    return (
      <>
        <DashboardHeader title="Reviews" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Reviews" subtitle={`${contractorReviewCount} total reviews`} />
      <main className="flex-1 p-6 space-y-6">
        {/* Summary */}
        <div className="bg-white rounded-xl border p-6 flex flex-wrap gap-8 items-center">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900">{contractorRating.toFixed(1)}</p>
            <div className="flex justify-center mt-1.5">
              <Stars rating={Math.round(contractorRating)} />
            </div>
            <p className="text-xs text-gray-500 mt-1">{contractorReviewCount} reviews</p>
          </div>

          <div className="flex-1 min-w-[200px] space-y-1.5">
            {distribution.map(({ stars, count, pct }) => (
              <button
                key={stars}
                onClick={() => setFilter(filter === stars ? null : stars)}
                className={`flex items-center gap-2 w-full text-xs rounded-md px-2 py-0.5 transition-colors ${filter === stars ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <Stars rating={stars} />
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-gray-500 w-4 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter badge */}
        {filter && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Showing {filter}-star reviews</span>
            <button
              onClick={() => setFilter(null)}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <p className="text-gray-400 text-sm">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{review.reviewer_name}</p>
                      {review.is_verified_customer && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    {review.reviewer_location && (
                      <p className="text-xs text-gray-400">{review.reviewer_location}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <Stars rating={review.rating} />
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {review.title && (
                  <p className="text-sm font-medium text-gray-800 mb-1">{review.title}</p>
                )}
                {review.content && (
                  <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                )}
                {review.project_type && (
                  <p className="mt-2 text-xs text-gray-400">Project: {review.project_type}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
