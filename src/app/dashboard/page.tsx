import { Eye, Star, MessageSquare, TrendingUp } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { LeadsCard } from '@/components/dashboard/LeadsCard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = createServerClient()

  // Load contractor for this user
  const { data: contractor } = await supabase
    .from('tbf_contractors')
    .select('id, business_name, rating, reviews_count, status, slug')
    .eq('user_id', user.id)
    .maybeSingle()

  // Load recent quote requests
  const { data: leads } = contractor
    ? await supabase
        .from('tbf_quote_requests')
        .select('id, name, service_type, city, created_at')
        .eq('contractor_id', contractor.id)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] }

  const totalLeads = contractor
    ? (await supabase
        .from('tbf_quote_requests')
        .select('id', { count: 'exact', head: true })
        .eq('contractor_id', contractor.id)).count ?? 0
    : 0

  const isPending = contractor?.status === 'pending'

  return (
    <>
      <DashboardHeader
        title={`Welcome back${contractor ? `, ${contractor.business_name}` : ''}!`}
        subtitle={isPending ? 'Your profile is under review — it will go live once approved.' : undefined}
      />

      <main className="flex-1 p-6 space-y-6">
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 text-amber-500 shrink-0">⏳</div>
            <div>
              <p className="text-sm font-medium text-amber-800">Profile under review</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Our team is reviewing your profile. You&apos;ll receive an email once it&apos;s approved (1–2 business days).
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Leads"
            value={totalLeads}
            icon={MessageSquare}
            color="blue"
          />
          <StatsCard
            label="Avg. Rating"
            value={contractor?.rating?.toFixed(1) ?? '—'}
            icon={Star}
            color="orange"
          />
          <StatsCard
            label="Reviews"
            value={contractor?.reviews_count ?? 0}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            label="Profile Views"
            value="—"
            icon={Eye}
            color="purple"
          />
        </div>

        {/* Leads + profile link */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeadsCard leads={(leads ?? []).map((l) => ({
              id: l.id,
              name: l.name,
              service: l.service_type ?? 'Service request',
              city: l.city ?? undefined,
              created_at: l.created_at,
            }))} />
          </div>

          <div className="space-y-4">
            {/* Profile preview */}
            {contractor && contractor.status === 'active' && (
              <div className="bg-white rounded-xl border p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Your public profile</h2>
                <p className="text-xs text-gray-500 mb-3">
                  This is what customers see when they find you in search.
                </p>
                <a
                  href={`/pro/${contractor.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-sm bg-gray-900 text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View profile →
                </a>
              </div>
            )}

            {/* DunaHub CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <h2 className="font-semibold mb-1">Full CRM</h2>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                Manage your entire sales pipeline, quotes, and follow-ups in DunaHub.
              </p>
              <a
                href="https://app.dunahub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-sm bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Open DunaHub
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
