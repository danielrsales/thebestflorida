'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'

interface Quote {
  id: number
  name: string
  email: string
  service_type: string | null
  city: string | null
  message: string
  created_at: string
  contractor: { business_name: string; slug: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  active:  'bg-blue-50 text-blue-700 border-blue-200',
  done:    'bg-green-50 text-green-700 border-green-200',
  closed:  'bg-gray-50 text-gray-500 border-gray-200',
}

export default function AccountPage() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) return
    const supabase = createClient()

    supabase
      .from('tbf_quote_requests')
      .select('id, name, email, service_type, city, message, created_at, tbf_contractors(business_name, slug)')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setQuotes(
          (data ?? []).map((q) => ({
            ...q,
            contractor: Array.isArray(q.tbf_contractors)
              ? (q.tbf_contractors[0] ?? null)
              : (q.tbf_contractors ?? null),
          }))
        )
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Quote requests you&apos;ve sent to local pros.</p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No requests yet.</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Find a local pro and send your first quote request.
          </p>
          <Link
            href="/"
            className="inline-flex text-sm bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find a Pro
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  {quote.contractor ? (
                    <Link
                      href={`/pro/${quote.contractor.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {quote.contractor.business_name}
                    </Link>
                  ) : (
                    <p className="font-semibold text-gray-900">Unknown Pro</p>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5">
                    {quote.service_type ? quote.service_type.replace(/-/g, ' ') : 'Service request'}
                    {quote.city ? ` · ${quote.city}` : ''}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${STATUS_COLORS['pending']}`}>
                  <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                  Pending
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{quote.message}</p>
              <p className="text-xs text-gray-400">
                Sent {new Date(quote.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _icons = { CheckCircle, XCircle }
