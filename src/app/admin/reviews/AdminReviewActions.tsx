'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface AdminReviewActionsProps {
  reviewId: string
  status: 'pending' | 'approved' | 'rejected'
}

export function AdminReviewActions({ reviewId, status }: AdminReviewActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  if (done) return <span className="text-xs text-gray-500">Done</span>

  async function action(act: 'approve' | 'reject') {
    setLoading(act)
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: act,
        reason: act === 'reject' ? rejectReason : undefined,
      }),
    })
    setLoading(null)
    if (res.ok) { setDone(true); window.location.reload() }
    else alert('Failed to update review.')
  }

  if (status !== 'pending') {
    return (
      <button
        onClick={() => action(status === 'approved' ? 'reject' : 'approve')}
        disabled={!!loading}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'approved' ? 'Reject' : 'Approve'}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <button
        onClick={() => action('approve')}
        disabled={!!loading}
        className="flex items-center gap-1 text-xs bg-green-900/40 text-green-400 border border-green-800 px-3 py-1.5 rounded-lg hover:bg-green-900/60 transition-colors disabled:opacity-50"
      >
        {loading === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
        Approve
      </button>

      {showReject ? (
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Rejection reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-red-500 w-40"
          />
          <button
            onClick={() => action('reject')}
            disabled={!!loading}
            className="flex items-center gap-1 text-xs bg-red-900/40 text-red-400 border border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-900/60 transition-colors disabled:opacity-50"
          >
            {loading === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Confirm Reject
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowReject(true)}
          className="flex items-center gap-1 text-xs bg-red-900/40 text-red-400 border border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-900/60 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Reject
        </button>
      )}
    </div>
  )
}
