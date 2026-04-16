'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'

interface MyReview {
  id: number
  rating: number
  title: string | null
  content: string | null
  created_at: string
  contractor: { business_name: string; slug: string } | null
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </span>
  )
}

export default function MyReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<MyReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) return
    const supabase = createClient()

    supabase
      .from('tbf_contractor_reviews')
      .select('id, rating, title, content, created_at, tbf_contractors(business_name, slug)')
      .or(`reviewer_email.eq.${user.email}`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(
          (data ?? []).map((r) => ({
            ...r,
            contractor: Array.isArray(r.tbf_contractors)
              ? (r.tbf_contractors[0] ?? null)
              : (r.tbf_contractors ?? null),
          }))
        )
        setLoading(false)
      })
  }, [user])

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Reviews you&apos;ve left for local pros.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center">
          <Star className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No reviews yet.</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">After working with a pro, leave a review to help others.</p>
          <Link href="/" className="inline-flex text-sm bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Find a Pro
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  {review.contractor ? (
                    <Link href={`/pro/${review.contractor.slug}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {review.contractor.business_name}
                    </Link>
                  ) : (
                    <p className="font-semibold text-gray-900">Pro</p>
                  )}
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.title && <p className="text-sm font-medium text-gray-800 mb-1">{review.title}</p>}
              {review.content && <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
