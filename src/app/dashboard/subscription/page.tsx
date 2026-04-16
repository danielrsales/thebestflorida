'use client'

import { useState, useEffect } from 'react'
import { Loader2, Check, Zap, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

interface ContractorSub {
  status: 'active' | 'inactive' | 'pending'
  is_sponsored: boolean
  sponsor_tier: 'gold' | 'silver' | 'bronze' | null
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started and get found.',
    features: [
      'Public profile listing',
      'Appear in search results',
      'Receive quote requests',
      'Basic analytics',
    ],
    cta: 'Current plan',
    tier: null,
    color: 'gray',
  },
  {
    name: 'Silver',
    price: '$29',
    period: '/month',
    description: 'Stand out from the crowd.',
    features: [
      'Everything in Free',
      'Silver badge on profile',
      'Priority placement in search',
      'Featured in category pages',
    ],
    cta: 'Upgrade to Silver',
    tier: 'silver' as const,
    color: 'blue',
  },
  {
    name: 'Gold',
    price: '$79',
    period: '/month',
    description: 'Maximum visibility.',
    features: [
      'Everything in Silver',
      'Gold badge on profile',
      'Top placement in search',
      'Homepage featured section',
      'Priority support',
    ],
    cta: 'Upgrade to Gold',
    tier: 'gold' as const,
    color: 'amber',
  },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sub, setSub] = useState<ContractorSub | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('tbf_contractors')
      .select('status, is_sponsored, sponsor_tier')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSub(data as ContractorSub)
        setLoading(false)
      })
  }, [user])

  const currentTier = sub?.sponsor_tier ?? null

  if (loading) {
    return (
      <>
        <DashboardHeader title="Subscription" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Subscription" subtitle="Choose a plan that fits your business" />
      <main className="flex-1 p-6">
        {/* Current plan badge */}
        <div className="mb-6 flex items-center gap-2">
          {currentTier ? (
            <>
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 capitalize">
                Current plan: <strong>{currentTier}</strong>
              </span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Current plan: <strong>Free</strong></span>
            </>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
          {PLANS.map((plan) => {
            const isCurrent = plan.tier === currentTier
            const isHigher =
              (!currentTier && plan.tier !== null) ||
              (currentTier === 'silver' && plan.tier === 'gold')

            return (
              <div
                key={plan.name}
                className={`rounded-xl border p-5 flex flex-col ${
                  plan.tier === 'gold'
                    ? 'border-amber-300 bg-amber-50'
                    : plan.tier === 'silver'
                    ? 'border-blue-200 bg-blue-50'
                    : 'bg-white'
                }`}
              >
                <div className="mb-4">
                  <p className="font-bold text-gray-900 text-lg">{plan.name}</p>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full text-sm font-medium py-2 rounded-lg bg-gray-100 text-gray-400 cursor-default"
                  >
                    Current plan
                  </button>
                ) : isHigher ? (
                  <button
                    onClick={() => alert('Stripe integration coming soon!')}
                    className={`w-full text-sm font-semibold py-2 rounded-lg transition-colors ${
                      plan.tier === 'gold'
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full text-sm font-medium py-2 rounded-lg bg-gray-100 text-gray-400 cursor-default"
                  >
                    Included
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Billing and plan upgrades powered by Stripe — coming soon.
        </p>
      </main>
    </>
  )
}
