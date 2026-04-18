import { getAllBadges } from '@/lib/badges'
import { createClient } from '@supabase/supabase-js'
import { BadgeIcon } from '@/components/badges/BadgeIcon'
import { AssignBadgeForm } from './AssignBadgeForm'
import type { ContractorBadge } from '@/lib/badges'

export const dynamic = 'force-dynamic'

interface ContractorWithBadges {
  id: string
  slug: string
  business_name: string
  badges: ContractorBadge[]
}

async function getContractorsWithBadges(): Promise<ContractorWithBadges[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data } = await supabase
    .from('tbf_contractors')
    .select('id, slug, business_name, badges:tbf_contractor_badges(*, badge:tbf_badges(*))')
    .eq('status', 'active')
    .order('business_name')
  return (data ?? []) as ContractorWithBadges[]
}

export default async function AdminBadgesPage() {
  const [badges, contractors] = await Promise.all([getAllBadges(), getContractorsWithBadges()])

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Badges</h1>
        <p className="text-sm text-gray-400 mt-1">Assign trust badges to contractors</p>
      </div>

      {/* Available badges */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Available Badges</h2>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <BadgeIcon key={b.id} badge={b as ContractorBadge['badge']} size="md" />
          ))}
        </div>
      </div>

      {/* Contractors */}
      <div className="space-y-4">
        {contractors.map((contractor) => (
          <div key={contractor.id} className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-gray-100">{contractor.business_name}</p>
                <p className="text-xs text-gray-500 mb-3">/pro/{contractor.slug}</p>
                <div className="flex flex-wrap gap-1.5">
                  {contractor.badges.length === 0 ? (
                    <span className="text-xs text-gray-600">No badges yet</span>
                  ) : (
                    contractor.badges.map((cb) => (
                      <BadgeIcon key={cb.id} badge={cb.badge} size="sm" />
                    ))
                  )}
                </div>
              </div>
              <AssignBadgeForm
                contractorId={contractor.id}
                badges={badges}
                assignedBadgeIds={contractor.badges.map((b) => b.badge_id)}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
