import { createClient } from '@supabase/supabase-js'

export interface Badge {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string
  category: 'verification' | 'achievement' | 'certification'
  created_at: string
}

export interface ContractorBadge {
  id: string
  contractor_id: string
  badge_id: string
  badge?: Badge
  verified_at: string
  expires_at: string | null
  verification_url: string | null
  notes: string | null
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function getAllBadges(): Promise<Badge[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('tbf_badges')
    .select('*')
    .order('category')
  return (data ?? []) as Badge[]
}

export async function getContractorBadges(contractorId: string): Promise<ContractorBadge[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('tbf_contractor_badges')
    .select('*, badge:tbf_badges(*)')
    .eq('contractor_id', contractorId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
  return (data ?? []) as ContractorBadge[]
}

export async function assignBadge(
  contractorId: string,
  badgeId: string,
  opts?: { verification_url?: string; expires_at?: string; notes?: string }
): Promise<void> {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('tbf_contractor_badges')
    .upsert({
      contractor_id: contractorId,
      badge_id: badgeId,
      verified_at: new Date().toISOString(),
      verification_url: opts?.verification_url ?? null,
      expires_at: opts?.expires_at ?? null,
      notes: opts?.notes ?? null,
    }, { onConflict: 'contractor_id,badge_id' })
  if (error) throw new Error(error.message)
}

export async function revokeBadge(contractorId: string, badgeId: string): Promise<void> {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('tbf_contractor_badges')
    .delete()
    .eq('contractor_id', contractorId)
    .eq('badge_id', badgeId)
  if (error) throw new Error(error.message)
}

export const BADGE_COLORS: Record<string, string> = {
  green:   'bg-green-50 text-green-800 border-green-200',
  blue:    'bg-blue-50 text-blue-800 border-blue-200',
  purple:  'bg-purple-50 text-purple-800 border-purple-200',
  yellow:  'bg-yellow-50 text-yellow-800 border-yellow-200',
  orange:  'bg-orange-50 text-orange-800 border-orange-200',
  gold:    'bg-amber-50 text-amber-800 border-amber-200',
  gray:    'bg-gray-50 text-gray-700 border-gray-200',
  indigo:  'bg-indigo-50 text-indigo-800 border-indigo-200',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}
