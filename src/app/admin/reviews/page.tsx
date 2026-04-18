import { CheckCircle, XCircle, Clock, Star, ExternalLink } from 'lucide-react'
import { adminGetAllReviews } from '@/lib/reviews'
import { AdminReviewActions } from './AdminReviewActions'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
}

export default async function AdminReviewsPage() {
  const reviews = await adminGetAllReviews()

  const pending  = reviews.filter((r) => r.status === 'pending')
  const approved = reviews.filter((r) => r.status === 'approved')
  const rejected = reviews.filter((r) => r.status === 'rejected')

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Reviews</h1>
          <p className="text-sm text-gray-400 mt-1">
            {pending.length} pending · {approved.length} approved · {rejected.length} rejected
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <p className="text-gray-400">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-xl border border-gray-700 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[review.status]}`}>
                      {review.status === 'pending' && <Clock className="inline w-3 h-3 mr-1" />}
                      {review.status === 'approved' && <CheckCircle className="inline w-3 h-3 mr-1" />}
                      {review.status === 'rejected' && <XCircle className="inline w-3 h-3 mr-1" />}
                      {review.status}
                    </span>
                    {review.verified && (
                      <span className="text-xs text-green-400 border border-green-800 bg-green-900/30 px-2 py-0.5 rounded-full">
                        ✓ Email verified
                      </span>
                    )}
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating_overall ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{review.rating_overall}</span>
                    </div>
                  </div>

                  {/* Reviewer + contractor */}
                  <p className="text-sm text-gray-200 font-medium">{review.reviewer_name}</p>
                  <p className="text-xs text-gray-500">{review.reviewer_email}</p>
                  {review.contractor_name && (
                    <p className="text-xs text-blue-400 mt-0.5">
                      For: {review.contractor_name}
                      {review.contractor_slug && (
                        <a href={`/pro/${review.contractor_slug}`} target="_blank" rel="noopener noreferrer"
                          className="ml-1 inline-flex items-center gap-0.5 hover:text-blue-300">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </p>
                  )}

                  {/* Content */}
                  {review.title && <p className="mt-2 text-sm font-semibold text-gray-200">{review.title}</p>}
                  <p className="mt-1 text-sm text-gray-400 line-clamp-3">{review.content}</p>

                  {review.rejection_reason && (
                    <p className="mt-2 text-xs text-red-400 bg-red-900/20 border border-red-800 rounded px-2 py-1">
                      Rejection reason: {review.rejection_reason}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-600">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <AdminReviewActions reviewId={review.id} status={review.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
